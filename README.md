## Overview

<https://pgh.coffee/>

<img width="3537" height="2055" alt="Screenshot of UI" src="https://github.com/user-attachments/assets/d77d3b31-169a-4117-b63e-0b5a78be2eb2" />


This repository contains the source code for pgh.coffee — a website focused on helping users discover coffee shops in Pittsburgh, PA. The site uses Next.js, Supabase for its PostgreSQL database, Zustand for state management, and Tailwind CSS for styling.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Tests](#tests)
- [API Documentation](#api-documentation)
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

If you’re interested in the dataset, pgh.coffee provides a public API that you can use to access information about coffee shops in Pittsburgh.

Full API documentation, including endpoints and response schemas, is available at [pgh.coffee/api-docs](https://pgh.coffee/api-docs).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to the Pittsburgh coffee community for their support and contributions to the data source.
