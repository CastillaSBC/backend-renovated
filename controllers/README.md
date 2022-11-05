# Controllers

The app controllers, which are responsible for handling requests and returning responses.

The structure of the controllers is seen as such:

```ts
export default async function controller_name(req: Request, res: Response) {
 // Controller Logic here
}
```

The controllers are then imported into the `routes.ts` file and then used in the routes.

Refer to `example_controller.ts` for an example of a controller.