// Babel plugin to transform import.meta.env to process.env for Jest
export default function () {
  return {
    visitor: {
      MemberExpression(path) {
        // Check if this is import.meta.env.VITE_API_URL
        if (
          path.node.object.type === 'MemberExpression' &&
          path.node.object.object?.type === 'MetaProperty' &&
          path.node.object.object.meta?.name === 'import' &&
          path.node.object.object.property?.name === 'meta' &&
          path.node.object.property?.name === 'env' &&
          path.node.property?.name === 'VITE_API_URL'
        ) {
          // Replace with process.env.VITE_API_URL || 'http://localhost:3000'
          path.replaceWithSourceString(
            "process.env.VITE_API_URL || 'http://localhost:3000'"
          );
        }
      },
    },
  };
}

