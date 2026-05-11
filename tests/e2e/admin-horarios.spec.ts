import { test, expect } from '@playwright/test';

test.describe('Admin Schedules Management', () => {
  const adminEmail = 'q4pawsdg@gmail.com';
  const adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'missing-password';

  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByPlaceholder('q4pawsdg@gmail.com').fill(adminEmail);
    await page.getByPlaceholder('••••••••').fill(adminPassword);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should toggle Sunday schedule', async ({ page }) => {
    // 1. Navegar a /admin/horarios
    await page.goto('/admin/horarios');
    await expect(page.getByText(/Gestión de Horarios/i)).toBeVisible();

    // 2. Desactivar Domingo (toggle) y guardar
    // Buscamos la fila de Domingo
    const sundayRow = page.locator('div').filter({ hasText: /^Domingo/ }).first();
    const sundaySwitch = sundayRow.getByRole('switch');
    
    const isInitiallyChecked = await sundaySwitch.getAttribute('aria-checked') === 'true';
    
    // Toggle
    await sundaySwitch.click();
    
    // Verificar que el botón "Guardar cambios" aparece (porque el estado es dirty)
    const saveBtn = page.getByRole('button', { name: /Guardar cambios/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // 3. Verificar toast "Horarios actualizados"
    await expect(page.getByText(/Horarios actualizados/i)).toBeVisible();

    // 4. Reactivar Domingo y guardar (limpieza)
    const currentChecked = await sundaySwitch.getAttribute('aria-checked') === 'true';
    if (currentChecked !== isInitiallyChecked) {
      await sundaySwitch.click();
      await page.getByRole('button', { name: /Guardar cambios/i }).click();
      await expect(page.getByText(/Horarios actualizados/i)).toBeVisible();
    }
  });
});
