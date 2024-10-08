## Overview

<https://pgh.coffee/>

![image](https://github.com/user-attachments/assets/01c7834c-80b5-4dea-b86f-c3ea548cbb64)

This repository contains a comprehensive data source of all the coffee shops in Pittsburgh, along with a Next.js application to display and explore this information. Whether you're a local resident looking for a new coffee spot or a visitor seeking the best cafes in the city, this project has you covered.

## Features

### 1. Coffee Shop Data Source

The data source is a curated collection of information about coffee shops in Pittsburgh, including:

- Name of the coffee shop
- Address
- Website

<!--
* Roaster
* Contact details (phone, email)
* Operating hours
* Specialties/menu highlights
* Customer reviews and ratings
-->

You can find the dataset of all 140+ shops at <https://pgh.coffee/api/shops/geojson>.

### 2. Next.js Web Application

The Next.js app provides a user-friendly interface to explore the coffee shop data.

<!--
Key features include:
* Interactive map displaying the location of each coffee shop
* Search functionality to find coffee shops based on name, location, or specialties
* Detailed profiles for each coffee shop, including contact information and reviews
* User reviews and ratings for each coffee shop
* Responsive design for a seamless experience on desktop and mobile devices
-->

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

4. **Run the Next.js App:**

```
npm run dev
```

The app will be accessible at <http://localhost:3000>.

## Contribution Guidelines

Contributions are welcome! If you discover a new coffee shop or have updates to existing information, please follow these guidelines:

1. Fork the repository.
2. Make your changes.
3. Create a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to the Pittsburgh coffee community for their support and contributions to the data source.
