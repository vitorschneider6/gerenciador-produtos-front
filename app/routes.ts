import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/products.tsx"),
  route("products/new", "routes/products.new.tsx"),
  route("products/:id/edit", "routes/products.$id.edit.tsx"),
  route("raw-materials", "routes/raw-materials.tsx"),
  route("raw-materials/new", "routes/raw-materials.new.tsx"),
  route("raw-materials/:id/edit", "routes/raw-materials.$id.edit.tsx"),
  route("production", "routes/production.tsx"),
] satisfies RouteConfig;
