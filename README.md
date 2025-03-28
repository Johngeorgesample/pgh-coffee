## Overview

<https://pgh.coffee/>

![image](https://github.com/user-attachments/assets/01c7834c-80b5-4dea-b86f-c3ea548cbb64)

This repository contains the source code for pgh.coffee — a website focused on helping users discover coffee shops in Pittsburgh, PA. The site uses Next.js, Supabase for its PostgreSQL database, Zustand for state management, and Tailwind CSS for styling.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Tests](#tests)
- [API Documentation](#api-documentation)
  - [Endpoints](#endpoints)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Getting Started

Follow these steps to get started with the project:

1. **Clone the Repository:**

```bash
git clone https://github.com/johngeorgeample/pgh-coffee.git
cd pgh-coffee
```

2. **Install Dependencies:**

```
npm install
```

3. **Get Mapbox Access Token**

- Visit [Mapbox](https://docs.mapbox.com/help/getting-started/access-tokens/) and create an access token with all Public scopes checked.
- Duplicate `.env.example` as `.env` and enter your Mapbox Access Token.

4. **Set up database**

_Coming soon_

5. **Run the Next.js App:**

```
npm run dev
```

The app will be accessible at <http://localhost:3000>.

## Tests

This project uses [Vitest](https://vitest.dev/) as its testing framework. Tests are located in the `/tests/unit` directory.

### Running Tests

```bash
# Run all tests
npm run test
```

## API Documentation

If you're interested in the dataset, pgh.coffee provides a public API that you can use to access information about coffee shops in Pittsburgh.

### Endpoints


- **Get coffee shops (GeoJSON)**  
  URL: [`https://pgh.coffee/api/shops/geojson`](https://pgh.coffee/api/shops/geojson)  
  Description: Returns the dataset of all coffee shops in GeoJSON format, including their names, addresses, and locations.

Here’s an example of what the JSON response will look like:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "61B Cafe",
        "neighborhood": "Regent Square",
        "website": "",
        "address": "1108 S Braddock Ave, Pittsburgh, PA 15218",
        "roaster": "",
        "photo": "https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos/regent_square/61b_cafe.jpg"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-79.893948, 40.432417]
      }
    },
    ...
  ]
}
```

- **Get single coffee shop (GeoJSON)**  
  URL: `https://pgh.coffee/api/shops/[shop-details]`  
  Description: Returns GeoJSON data for a single shop.  
  - `shop-details` is a combination of the shop's name and neighborhood, separated by an **underscore** (`_`).  
  - Spaces in names are replaced using **URL encoding** (e.g., a space becomes `%20`).  

For example:  
- The endpoint for **Ka-Fair** in **Morningside** would be:  
  `https://pgh.coffee/api/shops/Ka-Fair_Morningside`.  
- The endpoint for **De Fer Coffee & Tea** in **Downtown** would be:  
  `https://pgh.coffee/api/shops/De%20Fer%20Coffee%20&%20Tea_Downtown`.  



Here’s an example of what the JSON response will look like for Ka-Fair:

```json
{
  "type": "Feature",
  "properties": {
    "name": "Ka-Fair",
    "neighborhood": "Morningside",
    "address": "1806 Chislett St, Pittsburgh, PA 15206",
    "photo": "",
    "website": "https://kafaircakery.wixsite.com/kafair"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-79.9253955, 40.4855015]
  }
}
```

- **Get coffee shops (JSON)**  
  URL: [`https://pgh.coffee/api/shops`](https://pgh.coffee/api/shops)  
  Description: Returns the dataset of all coffee shops in a standard JSON format, including their names, addresses, and locations (without GeoJSON structure).

Here’s an example of what the JSON response will look like:


```json
[
  {
    "name": "61B Cafe",
    "neighborhood": "Regent Square",
    "website": "",
    "address": "1108 S Braddock Ave, Pittsburgh, PA 15218",
    "roaster": "",
    "longitude": -79.893948,
    "latitude": 40.432417,
    "photo": "https://uljutxoijtvtcxvatqso.supabase.co/storage/v1/object/public/shop-photos/regent_square/61b_cafe.jpg",
    "uuid": "78e3178d-b181-4f7f-a719-84b1f5288395"
  },
  ...
]
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to the Pittsburgh coffee community for their support and contributions to the data source.
