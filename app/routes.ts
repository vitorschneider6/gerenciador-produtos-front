import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/products.tsx"),
  route("products/new", "routes/products.new.tsx"),
  route("products/:id/edit", "routes/products.$id.edit.tsx"),
  route("raw-materials", "routes/raw-materials.tsx"),
  route("production", "routes/production.tsx"),
] satisfies RouteConfig;
