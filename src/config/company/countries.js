import { countriesCodeMap } from 'src/assets/jsons/countries'

const values = Object.values(countriesCodeMap)

export const countries = values.map((country) => {
  return country.alpha2Code
    ? {
        title: country.countryName,
        subtitle: country.alpha2Code,
        avatar: `https://flagcdn.com/w40/${country.alpha2Code.toLowerCase()}.png`,
      }
    : {
        title: country.countryName,
        subtitle: country.alpha2Code,
      }
})

// export const countries = [
//   'USA',
//   'CANADA',
//   'UNITED KINGDOM',
//   'GERMANY',
//   'FRANCE',
//   'AUSTRALIA',
//   'ITALY',
//   'SPAIN',
//   'ISRAEL',
//   'BRAZIL',
//   'INDIA',
//   'JAPAN',
//   'SOUTH KOREA',
//   'CHINA',
//   'MEXICO',
//   'NETHERLANDS',
//   'SWEDEN',
//   'NORWAY',
//   'SWITZERLAND',
//   'SINGAPORE',
// ]
