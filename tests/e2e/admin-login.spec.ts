import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  const adminEmail = 'q4pawsdg@gmail.com';
  const adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'missing-password';

  test('should login as admin and then logout', async ({ page }) => {
    // 1. Login con q4pawsdg@gmail.com
    await page.goto('/login');
    await page.getByPlaceholder('q4pawsdg@gmail.com').fill(adminEmail);
    await page.getByPlaceholder('••••••••').fill(adminPassword);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    // 2. Verificar redirección a /admin
    await expect(page).toHaveURL(/\/admin$/);

    // 3. Verificar que aparece la vista del día actual
    // Buscamos algo que indique que estamos en el dashboard de hoy
    await expect(page.getByText(/Vista diaria/i)).toBeVisible();

    // 4. Logout y verificar redirección a /login
    // El botón "Salir" está en el sidebar
    await page.getByRole('button', { name: /Salir/i }).click();
    
    // El logout en AdminLayout redirige a / con replace: true, o a /login?
    // Revisando AdminLayout.tsx: navigate('/', { replace: true })
    // Pero si vamos a /admin de nuevo, nos redirige a /login
    await expect(page).toHaveURL(/\/$/);
    
    // Si intentamos ir a /admin, deberíamos ser redirigidos a /login
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });
});
