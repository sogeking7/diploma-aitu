#!/bin/bash

# Set variables for easy configuration
OUTPUT_DIR="client/src/lib/open-api"
API_URL="http://localhost:8000/openapi.json"

# Clean previous generation
echo "Cleaning previous API client..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Check if server is accessible
echo "Checking if FastAPI server is accessible..."
if ! curl --output /dev/null --silent --head --fail "$API_URL"; then
    echo "❌ Server is not accessible at $API_URL"
    echo "Please make sure your FastAPI server is running and try again."
    exit 1
fi

echo "Generating TypeScript services from OpenAPI schema..."

npx @openapitools/openapi-generator-cli generate \
    -i "$API_URL" \
    -g typescript-axios \
    -o "$OUTPUT_DIR" \
    --api-package=api \
    --invoker-package=invoker \
    --model-package=model \
    --skip-validate-spec \
    --additional-properties=basePath=http://localhost:8000,supportsES6=true,enumPropertyNaming=original,fileNaming=kebab-case

# Clean up unnecessary files
echo "Cleaning up generated files..."
rm -rf "$OUTPUT_DIR/.gitignore" 
rm -rf "$OUTPUT_DIR/.openapi-generator-ignore"
rm -rf "$OUTPUT_DIR/.openapi-generator"

echo "✅ API client generated successfully at $OUTPUT_DIR"
