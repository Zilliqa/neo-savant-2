import zrc6 from './zrc6.scilla?raw';
import auction from './auction.scilla?raw';
import bookstore from './bookstore.scilla?raw';
import crowdfunding from './crowdfunding.scilla?raw';
import ecdsa from './ecdsa.scilla?raw';
import fungibleToken from './fungible_token.scilla?raw';
import helloWorld from './hello_world.scilla?raw';
import nonFungibleToken from './nonfungible_token.scilla?raw';
import schnorr from './schnorr.scilla?raw';
import zilGame from './zil_hash_game.scilla?raw';
import asciiart from './asciiart.scilla?raw';
import { ScillaFile } from 'src/utils';

export const defaultScillaContracts: ScillaFile[] = [
  { name: 'HelloWorld.scilla', code: helloWorld },
  { name: 'ZRC-6.scilla', code: zrc6 },
  { name: 'BookStore.scilla', code: bookstore },
  { name: 'CrowdFunding.scilla', code: crowdfunding },
  { name: 'Auction.scilla', code: auction },
  { name: 'FungibleToken.scilla', code: fungibleToken },
  { name: 'NonFungible.scilla', code: nonFungibleToken },
  { name: 'ZilGame.scilla', code: zilGame },
  { name: 'SchnorrTest.scilla', code: schnorr },
  { name: 'ECDSATest.scilla', code: ecdsa },
  { name: 'AsciiArt.scilla', code: asciiart },
];
