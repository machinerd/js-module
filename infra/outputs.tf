output "ecr_repository_url" {
  value = aws_ecr_repository.main.repository_url
}

output "pipeline_arn" {
  value = aws_codepipeline.main.arn
}
