import { test, expect } from '@playwright/test';

test.describe('Public Booking Flow', () => {
  test('should complete a full booking flow', async ({ page }) => {
    const timestamp = Date.now();
    const dogName = `TestDog-${timestamp}`;
    const ownerName = `Owner-${timestamp}`;
    const ownerEmail = `test-${timestamp}@example.com`;

    // 1. Navegar a /reservar
    await page.goto('/reservar');
    await expect(page).toHaveURL(/\/reservar/);

    // 2. Seleccionar servicio "Full Groom"
    // Buscamos el botón que contiene "Full Groom"
    await page.getByRole('button', { name: /Full Groom/i }).click();

    // 3. Completar datos del perro (nombre, raza, tamaño medium)
    await page.getByPlaceholder(/Ej: Luna, Max, Coco.../i).fill(dogName);
    await page.getByPlaceholder(/Ej: Golden Retriever, Poodle.../i).fill('Golden Retriever');
    
    // Seleccionar tamaño Mediano
    await page.getByRole('button', { name: /Mediano/i }).click();
    
    // Seleccionar Sexo Macho
    await page.getByRole('button', { name: /Macho/i }).click();
    
    // Continuar al paso 3
    await page.getByRole('button', { name: /Continuar/i }).click();

    // 4. Seleccionar el próximo slot disponible
    // Esperar a que el calendario cargue
    await expect(page.locator('.rdp-day:not([disabled])').first()).toBeVisible();
    
    // Seleccionar un día disponible (evitamos el primero por si acaso está muy cerca de la hora actual)
    const availableDays = page.locator('.rdp-day:not([disabled])');
    const dayCount = await availableDays.count();
    if (dayCount > 1) {
      await availableDays.nth(1).click();
    } else {
      await availableDays.first().click();
    }
    
    // Seleccionar el primer horario disponible
    await expect(page.locator('button:has-text("am"), button:has-text("pm")').first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("am"), button:has-text("pm")').first().click();
    
    // Continuar al paso 4
    await page.getByRole('button', { name: /Continuar/i }).click();

    // 5. Completar datos de contacto
    await page.getByPlaceholder(/Tu nombre y apellido/i).fill(ownerName);
    await page.getByPlaceholder(/tucorreo@email.com/i).fill(ownerEmail);
    await page.getByPlaceholder(/\+1 \(321\) 000-0000/i).fill('3211234567');

    // 6. Confirmar reserva
    await page.getByRole('button', { name: /Confirmar reserva/i }).click();

    // 7. Verificar que aparece pantalla de confirmación con el resumen de la cita
    await expect(page.getByText(/¡Reserva Recibida!/i)).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(dogName)).toBeVisible();
    await expect(page.getByText(/Full Groom/i)).toBeVisible();
  });
});
