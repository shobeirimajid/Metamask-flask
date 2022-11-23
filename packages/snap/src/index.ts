import { OnRpcRequestHandler } from '@metamask/snap-types';
import * as PushAPI from '@pushprotocol/restapi';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `PUSH Notifications!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
async function fetchNotifications() {
  let fetchedNotifications = await PushAPI.user.getFeeds({
    user: 'eip155:5:0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1', // user address in CAIP
    env: 'staging',
  });

  // Parse the notification fetched
  console.log('Notifications are ', fetchedNotifications);
  return 'Notifications ,See console for Notifications';
  // This is used to render the text present in a notification body as a JSX element
  // <NotificationItem
  //   notificationTitle={parsedResponse.title}
  //   notificationBody={parsedResponse.message}
  //   cta={parsedResponse.cta}
  //   app={parsedResponse.app}
  //   icon={parsedResponse.icon}
  //   image={parsedResponse.image}
  // />;
}

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent: fetchNotifications(),
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};
