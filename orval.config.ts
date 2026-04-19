import { defineConfig } from 'orval';

export default defineConfig({
  siteforce: {
    input: {
      // Download fresh from backend: yarn generate:api
      // Or save manually: browser → https://localhost:7102/swagger/v1/swagger.json → src/api/swagger.json
      target: './src/api/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'axiosInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
        header: () => [
          '// AUTO-GENERATED — do not edit manually.',
          '// Regenerate with: yarn generate:api:local',
          '',
        ],
      },
      prettier: true,
      tsconfig: './tsconfig.json',
    },
  },
});
