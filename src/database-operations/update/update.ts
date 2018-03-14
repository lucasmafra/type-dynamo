import { DynamoDB } from 'aws-sdk'
import DynamoToPromise from '../dynamo-to-promise'

export interface UpdateResult<TableModel> {
    data: TableModel
}

export async function update<Entity>(
    updateInput: DynamoDB.UpdateItemInput, dynamoPromise: DynamoToPromise,
): Promise<UpdateResult<Entity>> {
    const updateOutput = await dynamoPromise.update(updateInput)
    const result: UpdateResult<Entity> = {
        data: updateOutput.Attributes as any,
    }
    return result
}
