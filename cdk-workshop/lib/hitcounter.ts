import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface HitCounterProps {
  downstream: lambda.IFunction;
  readCapacity?: number;
}

export class HitCounter extends Construct {
  public readonly handler: lambda.Function;
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    if (props.readCapacity !== undefined && (props.readCapacity < 5 || props.readCapacity > 20)) {
      throw new Error('readCapacity must be between 5 and 20');
    }

    super(scope, id);

    const table = new dynamodb.Table(this, 'Hits', {
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING },
      readCapacity: props.readCapacity ?? 5,
    });
    this.table = table;

    this.handler = new lambda.Function(this, 'HitCounterHandler', {
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
      handler: 'hitcounter.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    table.grantReadWriteData(this.handler);

    props.downstream.grantInvoke(this.handler);
  }
}
