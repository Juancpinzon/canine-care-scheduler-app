# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: client-portal.spec.ts >> Client Portal Flow >> should register, login and add a dog
- Location: tests\e2e\client-portal.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Mis perros/i)
Expected: visible
Error: strict mode violation: getByText(/Mis perros/i) resolved to 4 elements:
    1) <a href="/mis-perros" data-lov-name="Link" data-component-line="112" data-component-name="Link" class="q4-nav-link active" data-component-content="%7B%7D" data-component-file="ClientLayout.tsx" data-lov-id="src\components\client\ClientLayout.tsx:112:16" data-component-path="src\components\client\ClientLayout.tsx">…</a> aka getByRole('link', { name: 'Mis Perros' })
    2) <h1 data-lov-name="h1" data-component-name="h1" data-component-line="361" data-component-file="MisPerros.tsx" data-lov-id="src\pages\client\MisPerros.tsx:361:10" data-component-path="src\pages\client\MisPerros.tsx" data-component-content="%7B%22text%22%3A%22Mis%20perros%22%7D">Mis perros</h1> aka getByRole('heading', { name: 'Mis perros' })
    3) <h1 data-lov-name="h1" data-component-name="h1" data-component-line="361" data-component-file="MisPerros.tsx" data-lov-id="src\pages\client\MisPerros.tsx:361:10" data-component-path="src\pages\client\MisPerros.tsx" data-component-content="%7B%22text%22%3A%22Mis%20perros%22%7D">Mis perros</h1> aka getByText('Mis perros').nth(2)
    4) <a href="/mis-perros" data-lov-name="Link" data-component-line="157" data-component-name="Link" class="q4-bottom-nav-item" data-component-file="ClientLayout.tsx" data-lov-id="src\components\client\ClientLayout.tsx:157:14" data-component-path="src\components\client\ClientLayout.tsx" data-component-content="%7B%22className%22%3A%22q4-bottom-nav-item%22%7D">…</a> aka getByText('Mis Perros').nth(3)

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/Mis perros/i)

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]: Q4 PAWS
        - generic [ref=e7]: Client 1778532805682
      - navigation [ref=e8]:
        - link "Citas" [ref=e9] [cursor=pointer]:
          - /url: /mis-citas
          - img [ref=e10]
          - text: Citas
        - link "Mis Perros" [ref=e12] [cursor=pointer]:
          - /url: /mis-perros
          - img [ref=e13]
          - text: Mis Perros
        - link "Perfil" [ref=e18] [cursor=pointer]:
          - /url: /perfil
          - img [ref=e19]
          - text: Perfil
      - button "Cerrar sesión" [ref=e23] [cursor=pointer]
    - main [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "Mis perros" [level=1] [ref=e27]
          - button "+ Agregar perro" [ref=e28] [cursor=pointer]
        - paragraph [ref=e29]: Gestiona los perfiles de tus mascotas.
        - generic [ref=e30]:
          - img [ref=e32]
          - paragraph [ref=e37]: Aún no has agregado ningún perro.
          - button "Agregar mi primer perro" [ref=e38] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Client Portal Flow', () => {
  4  |   test('should register, login and add a dog', async ({ page }) => {
  5  |     const timestamp = Date.now();
  6  |     const email = `client-${timestamp}@example.com`;
  7  |     const fullName = `Client ${timestamp}`;
  8  |     const dogName = `MyPet-${timestamp}`;
  9  | 
  10 |     // 1. Registro de cuenta nueva
  11 |     await page.goto('/registro');
  12 |     await page.getByPlaceholder(/Tu nombre y apellido/i).fill(fullName);
  13 |     await page.getByPlaceholder(/tucorreo@email.com/i).fill(email);
  14 |     await page.getByPlaceholder(/\+1 \(321\) 000-0000/i).fill('3210000000');
  15 |     await page.getByPlaceholder(/••••••••/i).fill('Password123!');
  16 |     await page.getByRole('button', { name: /Registrarse/i }).click();
  17 | 
  18 |     // Verificar redirección (el hook signUp de useAuth no loguea automáticamente a menos que se configure, 
  19 |     // pero mi implementación de Registro.tsx navega a /mis-citas después del signUp exitoso)
  20 |     // Nota: En Supabase, signUp puede requerir confirmación de email o loguear automáticamente.
  21 |     // El hook usePublicBooking asume que el usuario queda logueado o simplemente navega.
  22 |     await expect(page).toHaveURL(/\/mis-citas/);
  23 | 
  24 |     // 2. Navegar a /mis-perros
  25 |     await page.goto('/mis-perros');
> 26 |     await expect(page.getByText(/Mis perros/i)).toBeVisible();
     |                                                 ^ Error: expect(locator).toBeVisible() failed
  27 | 
  28 |     // 3. Agregar un perro con nombre y tamaño
  29 |     const addDogBtn = page.getByRole('button', { name: /Agregar perro/i }).or(page.getByRole('button', { name: /Agregar mi primer perro/i }));
  30 |     await addDogBtn.click();
  31 |     
  32 |     await page.getByPlaceholder(/Nombre del perro/i).fill(dogName);
  33 |     
  34 |     // Seleccionar tamaño Mediano
  35 |     // El select no tiene id, usamos el label
  36 |     await page.locator('select').first().selectOption('medium');
  37 |     
  38 |     // Guardar
  39 |     await page.getByRole('button', { name: /Agregar mascota/i }).click();
  40 | 
  41 |     // 4. Verificar que aparece en la lista
  42 |     await expect(page.getByText(dogName)).toBeVisible();
  43 |     await expect(page.getByText(/Mediano/i)).toBeVisible();
  44 |   });
  45 | });
  46 | 
```