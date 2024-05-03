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
import { ScillaContract } from 'src/utils';

export const defaultScillaContracts: ScillaContract[] = [
  { name: 'HelloWorld', code: helloWorld },
  { name: 'ZRC-6', code: zrc6 },
  { name: 'BookStore', code: bookstore },
  { name: 'CrowdFunding', code: crowdfunding },
  { name: 'Auction', code: auction },
  { name: 'FungibleToken', code: fungibleToken },
  { name: 'NonFungible', code: nonFungibleToken },
  { name: 'ZilGame', code: zilGame },
  { name: 'SchnorrTest', code: schnorr },
  { name: 'ECDSATest', code: ecdsa },
  { name: 'AsciiArt', code: asciiart },
];
