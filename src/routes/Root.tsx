import { Text } from "../design/Text";
import { TwoToneHeading } from "../components/TwoToneHeading";
import { Button } from "../design/Button";

import * as Auth from "../providers/auth";

export default function Root() {
  const { state, actions } = Auth.useAuth();

  return (
    <div
      data-testid="root-container"
      className="flex flex-col h-full justify-betweeen items-center"
    >
      <div className="flex flex-col flex-grow justify-center gap-y-8">
        <Text as="h1" variant="h3">
          <TwoToneHeading primary="Clouty" secondary="is coming soon" />
        </Text>
        <Text>If you see this, you're an authenticated user. Nice!</Text>
        <Button onClick={actions.signOut}>Logout</Button>
      </div>
      <details className="flex flex-shrink w-4/5 overflow-hidden">
        <summary>Engineer stuff</summary>
        <Text
          as="pre"
          variant="label"
          className="font-mono whitespace-pre-wrap"
        >
          {JSON.stringify(state.context.user, null, 2)}
        </Text>
      </details>
    </div>
  );
}
