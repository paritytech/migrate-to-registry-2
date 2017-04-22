# [Parity](https://ethcore.io/parity.html) [`Registry.sol`](https://github.com/ethcore/contracts/blob/b6f982b8ac5d47fe5d37f8bc6714f3e6149d8a50/Registry.sol) migration

[![Greenkeeper badge](https://badges.greenkeeper.io/ethcore/migrate-to-registry-2.svg)](https://greenkeeper.io/)

**A script to migrate the Registry data to v2.**

[![Join the chat at https://gitter.im/ethcore/parity][gitter-image]][gitter-url] [![GPLv3][license-image]][license-url]

[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/ethcore/parity
[license-image]: https://img.shields.io/badge/license-GPL%20v3-green.svg
[license-url]: https://www.gnu.org/licenses/gpl-3.0.en.html

## Caveats

- it doesn't migrate unconfirmed reverses yet

## Installation

You need a running & synced [Parity](https://ethcore.io/parity.html) at `localhost:8545`. Run with ` --jsonrpc-apis eth,parity` to enable the necessary RPCs.

```shell
git clone https://github.com/ethcore/migrate-to-registry-2.git
cd migrate-to-registry-2
npm install --production
```

## Usage

To collect all the data to be migrated:

```shell
./bin/collect
```

It will print JSON to stdout that looks like this:

```json
{
  "names": {
    "0xf2c3a518866ce68aa73555f2820cbaa20abc3142315ec258774d2572523aab4e": {
      "owner": "0x00156E4e5776c50c8a46719649AF09d01005d8D1",
      "data": {
        "A": "0x0000000000000000000000000273d59c5a34bd65cbba7463287e51b27a4680f5",
        "IMG": "0xb5eee083f7059c85c498e7c66f72d69f10a112d7f39ee5517c1b0b83e8032ee4",
        "CONTENT": "0x7a75399b1ace2ca0af83281eae4c6715bae9e2271ee7b558350d9ae06a5e4918"
      }
    },
    "0x0c75b3c43edc88919f0f4d336396817ef98fd8d789fb6a0527fd8c6a55e7e8bb": {
      "owner": "0x3A357Ea16210e1bfE0Bc1e1a5D811a13365334c3",
      "data": {}
    }
  },
  "reverses": {
    "0x008becf2201E2043eE86F55c1b09eF8a44E65028": "0xa1cac15d7e566bfd40a0d4454b5225c6c70892c26b5b82fdae2ff34ec581abd1",
    "0x639ba260535Db072A41115c472830846E4e9AD0F": "0x7e2e8dd118b0dbf6959def7dcc30f934860a9ac856004e19dbbfe46e5a4b4ba8",
    "0x0099C9123dd4BFE16184F7f7dE1931AD0EFB15a8": "0xb8c26d21508197a6d388fdc1a00f53c29d3cb254f741e085e2ad383c0cc51878",
    "0x00D189b71E5b42a88aa3e83173D4a6926e665336": "0x9a04d26f05c5110d55a24197765800853481cbc4f4be7bd4667662ac9f50b279"
  },
  "proposedReverses": {
    "0x72f4b7a806d8fd0a2f7d66c0CD1D71ea40Be5669": "0xf539ba76cb28bd8b154e5e1e046c11cc09c5a4831299ea08e5a04ce250df879f",
    "0x7Ae6d608CD96f5D34eD989211de85d7de1a31585": "0x0bc28e8a56f6ac080821132c5c7b44d4c9adc545974a554141622956bb261926",
    "0x639ba260535Db072A41115c472830846E4e9AD0F": "0x0bc28e8a56f6ac080821132c5c7b44d4c9adc545974a554141622956bb261926",
    "0x009D7053Fb15023F7090a15e52Eb71DF2d0a0f37": "0x1720680fc45940d6c1892e83e6b916986d068fc83e59caec592238237bd80410"
  }
}
```

To apply this data to the new registry:

```shell
./bin/collect | ./bin/migrate <address of new registry> <owner address of new registry>
```

Note that this script expects the registry to be deployed already. Also, you should set the `fee` to 0 to save ETH.
