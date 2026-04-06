#!/bin/bash
cat > config.js << EOF
export const CONFIG = {
    NYTIMES_API_KEY: "${NYTIMES_API_KEY}"
};
EOF