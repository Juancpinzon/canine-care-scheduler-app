import { test, expect } from '@playwright/test';

test.describe('Client Portal Flow', () => {
  test('should register, login and add a dog', async ({ page }) => {
    const timestamp = Date.now();
    const email = `client-${timestamp}@example.com`;
    const fullName = `Client ${timestamp}`;
    const dogName = `MyPet-${timestamp}`;

    // 1. Registro de cuenta nueva
    await page.goto('/registro');
    await page.getByPlaceholder(/Tu nombre y apellido/i).fill(fullName);
    await page.getByPlaceholder(/tucorreo@email.com/i).fill(email);
    await page.getByPlaceholder(/\+1 \(321\) 000-0000/i).fill('3210000000');
    await page.getByPlaceholder(/••••••••/i).fill('Password123!');
    await page.getByRole('button', { name: /Registrarse/i }).click();

    // Verificar redirección (el hook signUp de useAuth no loguea automáticamente a menos que se configure, 
    // pero mi implementación de Registro.tsx navega a /mis-citas después del signUp exitoso)
    // Nota: En Supabase, signUp puede requerir confirmación de email o loguear automáticamente.
    // El hook usePublicBooking asume que el usuario queda logueado o simplemente navega.
    await expect(page).toHaveURL(/\/mis-citas/);

    // 2. Navegar a /mis-perros
    await page.goto('/mis-perros');
    await expect(page.getByText(/Mis perros/i)).toBeVisible();

    // 3. Agregar un perro con nombre y tamaño
    const addDogBtn = page.getByRole('button', { name: /Agregar perro/i }).or(page.getByRole('button', { name: /Agregar mi primer perro/i }));
    await addDogBtn.click();
    
    await page.getByPlaceholder(/Nombre del perro/i).fill(dogName);
    
    // Seleccionar tamaño Mediano
    // El select no tiene id, usamos el label
    await page.locator('select').first().selectOption('medium');
    
    // Guardar
    await page.getByRole('button', { name: /Agregar mascota/i }).click();

    // 4. Verificar que aparece en la lista
    await expect(page.getByText(dogName)).toBeVisible();
    await expect(page.getByText(/Mediano/i)).toBeVisible();
  });
});
