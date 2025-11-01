#!/bin/bash

# Ajouter l'import Checkout
sed -i "/import NewOrder from/a import Checkout from './pages/Checkout';" src/App.tsx

# Ajouter la route Checkout avant </Routes>
sed -i '/<Route path="\/new-order"/a \        <Route\n          path="/checkout"\n          element={user ? <Checkout /> : <Navigate to="/login" />}\n        />' src/App.tsx

echo "✅ Route Checkout ajoutée"
