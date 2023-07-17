import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

// Configuration for DynamoDB
export const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.DYNAMO_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.DYNAMO_AWS_SECRET_ACCESS_KEY
  }
});

const dynamodb = DynamoDBDocument.from(dynamoClient);

export default dynamodb;
// Configuration for S3
// const s3Config = {
//   region: process.env.S3_AWS_REGION,
//   accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY
// };

// Create new instances of AWS.S3 and AWS.DynamoDB with the respective configurations
