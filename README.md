## Overview

<https://pgh.coffee/>

![image](https://github.com/user-attachments/assets/01c7834c-80b5-4dea-b86f-c3ea548cbb64)

This repository contains the source code for pgh.coffee — a website focused on helping users discover coffee shops in Pittsburgh, PA. The site uses Next.js, Supabase for its PostgreSQL database, Zustand for state management, and Tailwind CSS for styling.

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

## Public API

If you're interested in the dataset, pgh.coffee provides a public API that you can use to access information about coffee shops in Pittsburgh.

### Endpoints


- **Get Coffee Shops (GeoJSON)**  
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

- **Get Coffee Shops (JSON)**  
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
