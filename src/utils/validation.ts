// Copyright (C) 2020 Zilliqa

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https:www.gnu.org/licenses/>.

// import { validation } from '@zilliqa-js/util';

export const getParamType = (type: string) => {
  const regex =
    /(?<List>List (.+))|(?<ByStr20>ByStr20)|(?<String>String)|(?<ByStr>ByStr)(\d{1,})?|(?<Uint>Uint)\d{1,}|(?<Int>Int)\d{1,}|(?<BNum>BNum)/;

  const res = type.match(regex);
  let foundType = undefined;

  if (res !== null) {
    const results = res.groups;

    for (const key in results) {
      if (results[key] !== undefined) {
        foundType = key;
        break;
      }
    }

    if (res[0] !== res.input) {
      foundType = res[0];
    }
  }

  return foundType;
};

// const validateParam = ({ type, value }: { type: string; value: string }) => {
//   switch (type) {
//     case 'ByStr20': {
//       try {
//         if (validation.isAddress(value)) {
//           return true;
//         }

//         throw new Error('ByStr20 should be an address.');
//       } catch (error) {
//         throw new Error('ByStr20 should be an address.');
//       }
//     }
//     case 'List': {
//       try {
//         value = JSON.parse(value);
//       } catch (e) {
//         throw new Error('Lists should be defined as arrays: []');
//       }

//       if (!Array.isArray(value)) {
//         throw new Error('Lists should be defined as arrays: []');
//       }
//       return true;
//     }
//     case 'Uint': {
//       if (
//         (value && !Number.isInteger(parseInt(value))) ||
//         parseInt(value) < 0
//       ) {
//         throw new Error('Uint should be a positive integer number.');
//       }
//       return true;
//     }
//     case 'Int': {
//       if (value && !Number.isInteger(parseInt(value))) {
//         throw new Error('Int should be a integer number.');
//       }
//       return true;
//     }
//     default:
//       return true;
//   }
// };

// const validateParams = (params: { type: string; value: string }[]) => {
//   let errors = false;
//   for (const param of params) {
//     param.validationErrors = false;
//     try {
//       const type = getParamType(param.type);
//       validateParam({ ...param, type });
//     } catch (error) {
//       errors = true;
//       param.validationErrors = error.message;
//     }
//   }

//   return { errors, params };
// };

// export { validateParams, getParamType };
