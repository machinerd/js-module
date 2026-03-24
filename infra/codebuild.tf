# ARM build project
resource "aws_codebuild_project" "arm" {
  name          = "js-module-arm"
  description   = "ARM64 dev image build for js-module"
  build_timeout = 60
  service_role  = aws_iam_role.codebuild_arm.arn

  artifacts {
    type = "NO_ARTIFACTS"
    name = ""
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux-aarch64-standard:3.0"
    type                        = "ARM_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "APP_NAME"
      value = "js-module"
    }

    environment_variable {
      name  = "GITHUB_PAT"
      value = var.github_pat_ssm_path
      type  = "PARAMETER_STORE"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/${var.github_owner}/${var.github_repo}.git"
    git_clone_depth = 1
    buildspec       = "buildspec.yml"
  }

  tags = {
    App = "js-module"
  }
}

# AMD build project
resource "aws_codebuild_project" "amd" {
  name          = "js-module-amd"
  description   = "AMD64 dev image build for js-module"
  build_timeout = 60
  service_role  = aws_iam_role.codebuild_amd.arn

  artifacts {
    type = "NO_ARTIFACTS"
    name = ""
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "APP_NAME"
      value = "js-module"
    }

    environment_variable {
      name  = "GITHUB_PAT"
      value = var.github_pat_ssm_path
      type  = "PARAMETER_STORE"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/${var.github_owner}/${var.github_repo}.git"
    git_clone_depth = 1
    buildspec       = "buildspec.yml"
  }

  tags = {
    App = "js-module"
  }
}

# Deploy project (multi-arch manifest)
resource "aws_codebuild_project" "deploy" {
  name          = "js-module-deploy"
  description   = "Multi-arch manifest for js-module dev image"
  build_timeout = 60
  service_role  = aws_iam_role.codebuild_deploy.arn

  artifacts {
    type = "NO_ARTIFACTS"
    name = ""
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "APP_NAME"
      value = "js-module"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/${var.github_owner}/${var.github_repo}.git"
    git_clone_depth = 1
    buildspec       = "buildspec_deploy.yml"
  }

  tags = {
    App = "js-module"
  }
}
