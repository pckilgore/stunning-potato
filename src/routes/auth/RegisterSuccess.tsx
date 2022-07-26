import { Text } from '../../design/Text';
import { Button } from '../../design/Button';
import * as Auth from "../../providers/auth";

export function RegisterSuccess() {
  const actions = Auth.useActions();

  return (
    <div className="flex flex-col gap-y-4 h-96 justify-center items-center">
      <Text as="h2" variant="h4" color="text-accent-green">
        You've been confirmed! You may now login.
      </Text>
      <Button onClick={actions.requestLogin}>Login</Button>
    </div>
  );
}
