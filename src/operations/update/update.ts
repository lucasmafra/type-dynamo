import { DynamoDB } from 'aws-sdk'
import DynamoClient from '../dynamo-client'

export interface UpdateResult<TableModel> {
    data: TableModel
}

export async function update<Entity>(
    updateInput: DynamoDB.UpdateItemInput, dynamoClient: DynamoClient,
): Promise<UpdateResult<Entity>> {
    const updateOutput = await dynamoClient.update(updateInput)
    const result: UpdateResult<Entity> = {
        data: updateOutput.Attributes as any,
    }
    return result
}
