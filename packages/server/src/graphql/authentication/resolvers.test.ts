import { Container } from "typedi";

import {
  MutationLoginArgs,
  ResolversTypes
} from "../resolvers-types.generated";
import { AuthenticationService } from "./AuthenticationService";
import resolvers from "./resolvers";

const login = resolvers.Mutation!.login! as (
  rootValue: any,
  args: MutationLoginArgs,
  context: any
) => ResolversTypes["LoginPayload"];

describe("login authentication resolver", () => {
  test("on login success", async () => {
    // Given
    const user = { id: 123 };
    const authenticationService: Partial<AuthenticationService> = {
      findUserByEmailAndPassword: jest.fn().mockResolvedValue(user)
    };
    Container.set(AuthenticationService, authenticationService);

    // When
    const result = await login(
      undefined,
      {
        input: { email: "example@email.com", password: "password" }
      },
      {}
    );

    // Then
    expect(
      authenticationService.findUserByEmailAndPassword
    ).toHaveBeenCalledWith("example@email.com", "password");

    expect(result).toMatchObject({
      success: true,
      message: "Login success!",
      authToken: expect.any(String)
    });
  });

  test("on error error", async () => {
    // Given
    const user = undefined;
    const authenticationService: Partial<AuthenticationService> = {
      findUserByEmailAndPassword: jest.fn().mockResolvedValue(user)
    };
    Container.set(AuthenticationService, authenticationService);

    // When
    const result = await login(
      undefined,
      { input: { email: "example@email.com", password: "invalid password" } },
      {}
    );

    // Then
    expect(result).toMatchObject({
      success: false,
      message: "Invalid email or password!",
      authToken: null
    });
  });
});
