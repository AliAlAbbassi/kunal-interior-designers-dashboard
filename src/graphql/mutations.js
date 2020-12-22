/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTest = /* GraphQL */ `
  mutation CreateTest(
    $input: CreateTestInput!
    $condition: ModeltestConditionInput
  ) {
    createTest(input: $input, condition: $condition) {
      id
      field
      createdAt
      updatedAt
    }
  }
`;
export const updateTest = /* GraphQL */ `
  mutation UpdateTest(
    $input: UpdateTestInput!
    $condition: ModeltestConditionInput
  ) {
    updateTest(input: $input, condition: $condition) {
      id
      field
      createdAt
      updatedAt
    }
  }
`;
export const deleteTest = /* GraphQL */ `
  mutation DeleteTest(
    $input: DeleteTestInput!
    $condition: ModeltestConditionInput
  ) {
    deleteTest(input: $input, condition: $condition) {
      id
      field
      createdAt
      updatedAt
    }
  }
`;
