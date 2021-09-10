# Parrot IDO - Frontend

I modified version of the [Mango Token Sale](https://github.com/blockworks-foundation/mango-token-sale) with some improvements.

The main changes are:

- Support for multiple IDO pools
- Support for RPC selection
- Parrot UI components/styling

## How to use

Firstly you need to copy the `.env.example` file to `.env` and change the `IDO_START` and `NETWORK` accordingly.

For development:

```bash
yarn dev
```

For production:

```bash
yarn build
```

NOTE: it will build and export a static HTML version

## Configuration

The configuration for the awaitables RPCs and IDO pools are in [constants.ts](./src/config/constants.ts)

## Testing

We use `storybook` to test the different states of the pool

```bash
yarn storybook:dev
```
