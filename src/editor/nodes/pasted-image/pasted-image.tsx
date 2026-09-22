'use client';

import { Node, mergeAttributes, type NodeViewProps } from '@tiptap/core';
import {
  Fragment,
  Slice,
  type Node as ProseMirrorNode,
} from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { BasicImage } from '../basic-image';
import { SUBSET_IMAGE } from '../subset-image';
import {
  createPastedImageUploader,
  type PastedImageUploaderOptions,
} from '../../../util/image-upload';
import {
  PASTED_IMAGE_TAG,
  type UploadedImage,
  type UploadPastedImage,
} from '../../../util/editor-image';

export interface PastedImageOptions extends Partial<PastedImageUploaderOptions> {
  upload?: UploadPastedImage;
  isHostedImage?: (src: string) => boolean;
}

const NODE_NAME = 'pastedImage';
const imageNames = new Set([BasicImage.name, SUBSET_IMAGE.name, 'nextImage']);

interface Job {
  source: File | string;
  original: ProseMirrorNode;
  running?: boolean;
  result?: UploadedImage;
}

function PastedImageView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const failed = node.attrs.status === 'error';
  return (
    <NodeViewWrapper
      className="komc:my-3 komc:rounded-md komc:border komc:border-neutral-300 komc:bg-neutral-50 komc:p-3"
      contentEditable={false}
    >
      <div
        className="komc:flex komc:items-center komc:gap-3 komc:text-sm"
        role="status"
        aria-live="polite"
      >
        {!failed && (
          <span className="komc:size-4 komc:shrink-0 komc:animate-spin komc:rounded-full komc:border-2 komc:border-neutral-300 komc:border-t-blue-500" />
        )}
        <span
          className={failed ? 'komc:text-red-600' : 'komc:text-neutral-600'}
        >
          {failed
            ? node.attrs.message
            : '이미지를 임시 저장소에 업로드하고 있습니다…'}
        </span>
        {failed && (
          <button
            type="button"
            className="komc:shrink-0 komc:text-blue-600 komc:hover:underline"
            onClick={() =>
              updateAttributes({ status: 'uploading', message: '' })
            }
          >
            다시 시도
          </button>
        )}
        <button
          type="button"
          className="komc:ml-auto komc:shrink-0 komc:text-neutral-500 komc:hover:underline"
          onClick={deleteNode}
        >
          삭제
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export const PastedImage = Node.create<PastedImageOptions>({
  name: NODE_NAME,
  group: 'block',
  atom: true,
  draggable: true,
  priority: 1000,
  addOptions() {
    return {
      api: undefined,
      importEndpoint: '/api/editor/import-image',
      maxWidth: 829,
      upload: undefined,
      isHostedImage: undefined,
    };
  },
  addAttributes() {
    return {
      uploadId: { default: '' },
      status: { default: 'uploading' },
      message: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: PASTED_IMAGE_TAG }];
  },
  renderHTML({ HTMLAttributes }) {
    return [PASTED_IMAGE_TAG, mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PastedImageView);
  },
  addProseMirrorPlugins() {
    const { api, importEndpoint, maxWidth } = this.options;
    const uploadPastedImage: UploadPastedImage =
      this.options.upload ??
      (api
        ? createPastedImageUploader({ api, importEndpoint, maxWidth })
        : async () => {
            throw new Error('PastedImage.configure({ api }) is required.');
          });
    const isHostedImage =
      this.options.isHostedImage ??
      ((src: string) => api?.media.isHostedImage(src) ?? false);
    const jobs = new Map<string, Job>();
    let controller = new AbortController();
    let currentView: EditorView | undefined;
    let scheduled = false;
    let destroyed = false;
    let active = 0;

    const findPlaceholder = (id: string) => {
      let found: { node: ProseMirrorNode; pos: number } | undefined;

      currentView?.state.doc.descendants((node, pos) => {
        if (
          !found &&
          node.type.name === NODE_NAME &&
          node.attrs.uploadId === id
        ) {
          found = { node, pos };
        }
      });

      return found;
    };

    const finish = (id: string, job?: Job, message?: string) => {
      if (destroyed || !currentView) return;

      const found = findPlaceholder(id);

      if (!found) return;

      const { node, pos } = found;
      const tr = currentView.state.tr;

      if (job?.result) {
        const type = currentView.state.schema.nodes[SUBSET_IMAGE.name];

        tr.setNodeMarkup(
          pos,
          type,
          {
            ...job.original.attrs,
            ...job.result,
            alt: job.original.attrs.alt || 'Pasted image',
          },
          job.original.marks,
        );
      } else {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          status: 'error',
          message: message || 'Failed to upload the image.',
        });
      }

      currentView.dispatch(tr.setMeta('addToHistory', false));
    };

    const pump = () => {
      scheduled = false;

      if (destroyed || !currentView) return;

      const pending: string[] = [];

      currentView.state.doc.descendants((node) => {
        if (node.type.name === NODE_NAME && node.attrs.status !== 'error') {
          pending.push(node.attrs.uploadId);
        }
      });

      for (const id of pending) {
        const job = jobs.get(id);

        if (!job) {
          finish(
            id,
            undefined,
            'Clipboard image data is missing. Delete the image and paste it again.',
          );
          continue;
        }

        if (job.result) {
          finish(id, job);
          continue;
        }

        if (job.running || active >= 3) continue;

        job.running = true;
        active++;

        const signal = AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(90_000),
        ]);

        void uploadPastedImage(job.source, signal)
          .then(
            (result) => {
              job.result = result;
              job.source = result.src;
              job.original = job.original.type.create(
                { ...job.original.attrs, src: result.src },
                job.original.content,
                job.original.marks,
              );
              finish(id, job);
            },
            (cause) => {
              finish(
                id,
                undefined,
                cause instanceof Error
                  ? cause.message
                  : 'Failed to upload the image.',
              );
            },
          )
          .finally(() => {
            active--;
            job.running = false;
            schedule();
          });
      }
    };

    const schedule = () => {
      if (scheduled || destroyed) return;

      scheduled = true;
      queueMicrotask(pump);
    };

    return [
      new Plugin({
        key: new PluginKey('pastedImageUpload'),
        props: {
          handlePaste(view, event, slice) {
            if (
              !view.editable ||
              view.state.selection.$from.parent.type.spec.code
            ) {
              return false;
            }

            const clipboard = event.clipboardData;

            if (!clipboard) return false;

            const files = Array.from(clipboard.files).filter((file) =>
              file.type.startsWith('image/'),
            );

            let imageCount = 0;

            slice.content.descendants((node) => {
              if (imageNames.has(node.type.name)) imageCount++;
            });

            let changed = false;

            const placeholder = (
              source: File | string,
              original: ProseMirrorNode,
            ) => {
              const uploadId = crypto.randomUUID();

              jobs.set(uploadId, { source, original });
              changed = true;

              return view.state.schema.nodes[NODE_NAME].create({ uploadId });
            };

            const transform = (fragment: Fragment): Fragment => {
              const nodes: ProseMirrorNode[] = [];

              fragment.forEach((node) => {
                if (imageNames.has(node.type.name)) {
                  const src = String(node.attrs.src || '');
                  const localNextImage =
                    node.type.name === 'nextImage' &&
                    !/^(https?:|data:|blob:)/i.test(src);

                  if (!localNextImage && !isHostedImage(src)) {
                    nodes.push(
                      placeholder(
                        imageCount === 1 && files.length === 1 ? files[0] : src,
                        node,
                      ),
                    );
                    return;
                  }
                }

                if (node.type.name === NODE_NAME) {
                  const existing = jobs.get(node.attrs.uploadId);

                  nodes.push(
                    existing
                      ? placeholder(existing.source, existing.original)
                      : node.type.create({ uploadId: crypto.randomUUID() }),
                  );
                  changed = true;
                  return;
                }

                nodes.push(
                  node.content.size ? node.copy(transform(node.content)) : node,
                );
              });
              return Fragment.fromArray(nodes);
            };

            let content = transform(slice.content);
            let pasted = new Slice(content, slice.openStart, slice.openEnd);

            if (imageCount === 0 && files.length) {
              const images = files.map((file) =>
                placeholder(
                  file,
                  view.state.schema.nodes[BasicImage.name].create({
                    imagePosition: 'center',
                  }),
                ),
              );

              content = content.append(Fragment.fromArray(images));
              pasted = new Slice(content, slice.openStart, 0);
            }

            if (!changed) return false;

            event.preventDefault();
            view.dispatch(
              view.state.tr
                .replaceSelection(pasted)
                .scrollIntoView()
                .setMeta('paste', true)
                .setMeta('uiEvent', 'paste'),
            );
            schedule();

            return true;
          },
        },
        view(view) {
          if (controller.signal.aborted) controller = new AbortController();

          destroyed = false;
          currentView = view;
          schedule();

          return {
            update(nextView) {
              currentView = nextView;
              schedule();
            },
            destroy() {
              currentView = undefined;

              queueMicrotask(() => {
                if (currentView) return;

                destroyed = true;
                controller.abort();
                jobs.clear();
              });
            },
          };
        },
      }),
    ];
  },
});
