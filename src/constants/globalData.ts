export interface BasicInfo {
 landSizeKm2: number;
 population: number;
 continent: string;
 president: string;
 languages: string;
 religion: string;
 landmark: string;
 plugType: string;
 drivingSide: string;
 emergencyNumber: string;
 dialCode: string;
 description: string;
 capital: string;
 gdp: string;
 gdpPerCapita: string;
}

export interface CountryDetails {
 currencyRate: number; // 1 USD = X Local Currency
 basicInfo: BasicInfo;
 landShapeImage: string;
}

export const COUNTRY_DETAILS: Record<string, CountryDetails> = {
"United States": {
 currencyRate: 1,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Map_of_USA_with_state_names.svg/1200px-Map_of_USA_with_state_names.svg.png",
 basicInfo: {
 landSizeKm2: 9833517,
 population: 331000000,
 continent:"North America",
 president:"Joe Biden",
 languages:"English",
 religion:"Christianity",
 landmark:"Statue of Liberty",
 plugType:"A/B",
 drivingSide:"Right",
 emergencyNumber:"911",
 dialCode:"+1",
 description:"A land of diverse landscapes and cultures, known for its innovation, entertainment industry, and iconic landmarks.",
 capital:"Washington, D.C.",
 gdp:"$27.3T",
 gdpPerCapita:"$81,600"
 }
 },
"Philippines": {
 currencyRate: 56.0,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Philippines_location_map.svg/800px-Philippines_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 343448,
 population: 113000000,
 continent:"Asia",
 president:"Ferdinand Marcos Jr.",
 languages:"Filipino, English",
 religion:"Christianity",
 landmark:"Mayon Volcano",
 plugType:"A/B/C",
 drivingSide:"Right",
 emergencyNumber:"911",
 dialCode:"+63",
 description:"An archipelago nation known for its stunning beaches, vibrant festivals, and warm, hospitable people.",
 capital:"Manila",
 gdp:"$437B",
 gdpPerCapita:"$3,800"
 }
 },
"Japan": {
 currencyRate: 150.2,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Japan_location_map.svg/800px-Japan_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 377975,
 population: 125000000,
 continent:"Asia",
 president:"Shigeru Ishiba",
 languages:"Japanese",
 religion:"Shinto, Buddhism",
 landmark:"Mount Fuji",
 plugType:"A/B",
 drivingSide:"Left",
 emergencyNumber:"119",
 dialCode:"+81",
 description:"A fascinating blend of ancient traditions and futuristic technology, famous for its cuisine, anime, and serene landscapes.",
 capital:"Tokyo",
 gdp:"$4.2T",
 gdpPerCapita:"$34,000"
 }
 },
"Vietnam": {
 currencyRate: 24500,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Vietnam_location_map.svg/800px-Vietnam_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 331210,
 population: 97000000,
 continent:"Asia",
 president:"Luong Cuong",
 languages:"Vietnamese",
 religion:"Buddhism, Folk religion",
 landmark:"Ha Long Bay",
 plugType:"A/C",
 drivingSide:"Right",
 emergencyNumber:"113",
 dialCode:"+84",
 description:"Known for its breathtaking natural beauty, rich history, and incredibly flavorful street food culture.",
 capital:"Hanoi",
 gdp:"$430B",
 gdpPerCapita:"$4,300"
 }
 },
"Thailand": {
 currencyRate: 35.8,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Thailand_location_map.svg/800px-Thailand_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 513120,
 population: 71000000,
 continent:"Asia",
 president:"Paetongtarn Shinawatra",
 languages:"Thai",
 religion:"Buddhism",
 landmark:"Grand Palace",
 plugType:"A/B/C",
 drivingSide:"Left",
 emergencyNumber:"191",
 dialCode:"+66",
 description:"Famous for its tropical beaches, opulent royal palaces, ancient ruins, and ornate temples.",
 capital:"Bangkok",
 gdp:"$500B",
 gdpPerCapita:"$7,000"
 }
 },
"Malaysia": {
 currencyRate: 4.77,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Malaysia_location_map.svg/800px-Malaysia_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 330803,
 population: 33000000,
 continent:"Asia",
 president:"Anwar Ibrahim",
 languages:"Malay",
 religion:"Islam",
 landmark:"Petronas Towers",
 plugType:"G",
 drivingSide:"Left",
 emergencyNumber:"999",
 dialCode:"+60",
 description:"A multicultural melting pot known for its diverse culinary scene, rainforests, and modern cityscapes.",
 capital:"Kuala Lumpur",
 gdp:"$400B",
 gdpPerCapita:"$12,000"
 }
 },
"Singapore": {
 currencyRate: 1.34,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Singapore_location_map.svg/800px-Singapore_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 728,
 population: 5900000,
 continent:"Asia",
 president:"Lawrence Wong",
 languages:"English, Malay, Mandarin, Tamil",
 religion:"Buddhism, Islam, Christianity",
 landmark:"Marina Bay Sands",
 plugType:"G",
 drivingSide:"Left",
 emergencyNumber:"999",
 dialCode:"+65",
 description:"A modern city-state known for its cleanliness, efficiency, lush greenery, and diverse cultural heritage.",
 capital:"Singapore",
 gdp:"$500B",
 gdpPerCapita:"$85,000"
 }
 },
"Pakistan": {
 currencyRate: 278.5,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Pakistan_location_map.svg/800px-Pakistan_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 881913,
 population: 231000000,
 continent:"Asia",
 president:"Asif Ali Zardari",
 languages:"Urdu, English",
 religion:"Islam",
 landmark:"Badshahi Mosque",
 plugType:"C/D/G",
 drivingSide:"Left",
 emergencyNumber:"1122",
 dialCode:"+92",
 description:"A land of dramatic landscapes, from the Himalayas to the Indus River, with a rich history and vibrant culture.",
 capital:"Islamabad",
 gdp:"$340B",
 gdpPerCapita:"$1,500"
 }
 },
"Bangladesh": {
 currencyRate: 109.5,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Bangladesh_location_map.svg/800px-Bangladesh_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 148460,
 population: 169000000,
 continent:"Asia",
 president:"Mohammed Shahabuddin",
 languages:"Bengali",
 religion:"Islam",
 landmark:"Sundarbans",
 plugType:"C/D/G",
 drivingSide:"Left",
 emergencyNumber:"999",
 dialCode:"+880",
 description:"A riverine nation known for its lush green landscape, rich cultural heritage, and the world's largest mangrove forest.",
 capital:"Dhaka",
 gdp:"$450B",
 gdpPerCapita:"$2,700"
 }
 },
"Egypt": {
 currencyRate: 30.9,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Egypt_location_map.svg/800px-Egypt_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 1002450,
 population: 109000000,
 continent:"Africa",
 president:"Abdel Fattah el-Sisi",
 languages:"Arabic",
 religion:"Islam",
 landmark:"Pyramids of Giza",
 plugType:"C",
 drivingSide:"Right",
 emergencyNumber:"122",
 dialCode:"+20",
 description:"Home to ancient civilizations, iconic monuments, and a rich history that spans millennia.",
 capital:"Cairo",
 gdp:"$380B",
 gdpPerCapita:"$3,500"
 }
 },
"Saudi Arabia": {
 currencyRate: 3.75,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Saudi_Arabia_location_map.svg/800px-Saudi_Arabia_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 2149690,
 population: 36000000,
 continent:"Asia",
 president:"Salman bin Abdulaziz",
 languages:"Arabic",
 religion:"Islam",
 landmark:"Kaaba",
 plugType:"G",
 drivingSide:"Right",
 emergencyNumber:"911",
 dialCode:"+966",
 description:"A country with a deep religious significance, vast deserts, and a rapidly modernizing society.",
 capital:"Riyadh",
 gdp:"$1.1T",
 gdpPerCapita:"$30,000"
 }
 },
"Colombia": {
 currencyRate: 3900,
 landShapeImage:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Colombia_location_map.svg/800px-Colombia_location_map.svg.png",
 basicInfo: {
 landSizeKm2: 1141748,
 population: 51000000,
 continent:"South America",
 president:"Gustavo Petro",
 languages:"Spanish",
 religion:"Christianity",
 landmark:"Cartagena",
 plugType:"A/B",
 drivingSide:"Right",
 emergencyNumber:"123",
 dialCode:"+57",
 description:"A vibrant country with diverse landscapes, from the Andes mountains to the Caribbean coast, known for its coffee and culture.",
 capital:"Bogotá",
 gdp:"$360B",
 gdpPerCapita:"$7,000"
 }
 }
};
