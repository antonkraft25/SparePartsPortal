import { Component, inject, Input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';
import { AppValidators } from '../../../core/validators/app-validators';

@Component({
  selector: 'app-sparepart-details',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './sparepart-details.html',
  styleUrl: './sparepart-details.css',
})
export class SparepartDetails {
  private sparepartService = inject(SparepartService);
  private toastService = inject(ToastService);

  @Input() isModalOpen = false;
  sparepart: Sparepart | null = null;

  sparepartSaved = output<Sparepart>();
  sparepartDeactivated = output<string>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    prize: new FormControl('', [
      Validators.required,
      AppValidators.numeric(),
      AppValidators.minValue(0),
    ]),
    purchasePrize: new FormControl('', [
      Validators.required,
      AppValidators.numeric(),
      AppValidators.minValue(0),
    ]),
    balance: new FormControl(0, [Validators.required, AppValidators.minValue(0)]),
  });

  openModal(sparepart: Sparepart) {
    this.sparepart = { ...sparepart };
    this.form.patchValue(sparepart);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.sparepart = null;
  }

  saveSparepart() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updated = { ...this.sparepart!, ...this.form.value };

    this.sparepartService.updateSparepart(updated as Sparepart).subscribe({
      next: (result) => {
        this.toastService.success('Reservdel uppdaterad!');
        this.sparepartSaved.emit(result);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid uppdatering!');
        console.error(err);
      },
    });
  }

  deactivateSparepart() {
    if (!this.sparepart) return;
    this.sparepartService.deleteSparepart(this.sparepart.id).subscribe({
      next: () => {
        this.toastService.success('Reservdel borttagen!');
        this.sparepartDeactivated.emit(this.sparepart!.id);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid borttagning!');
        console.error(err);
      },
    });
  }
}
