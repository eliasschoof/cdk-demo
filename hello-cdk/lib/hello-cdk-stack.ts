import { RemovalPolicy, aws_s3 as S3, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class HelloCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new S3.Bucket(this, 'MyFirstBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      versioned: true,
    });
  }
}
