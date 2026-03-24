variable "codestar_connection_arn" {
  description = "ARN of the existing CodeStar connection to GitHub"
  default     = "arn:aws:codestar-connections:ap-northeast-2:401965576390:connection/694692f5-7b36-46e2-83e0-f7fc36c84eb7"
}

variable "artifact_bucket" {
  description = "S3 bucket for CodePipeline artifacts"
  default     = "codepipeline-ap-northeast-2-897746244046"
}

variable "github_repo" {
  description = "GitHub repository name"
  default     = "js-module"
}

variable "github_owner" {
  description = "GitHub repository owner"
  default     = "machinerd"
}

variable "github_pat_ssm_path" {
  description = "SSM Parameter Store path for GITHUB_PAT"
  default     = "/codebuild/github_pat"
}

variable "github_branch" {
  type    = string
  default = "main"
}
