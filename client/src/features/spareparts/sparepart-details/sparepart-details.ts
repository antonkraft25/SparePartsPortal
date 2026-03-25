import { Component, inject, Input, input, output } from '@angular/core';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-sparepart-details',
  imports: [FormsModule],
  templateUrl: './sparepart-details.html',
  styleUrl: './sparepart-details.css',
})
export class SparepartDetails {
  protected sparepartService = inject(SparepartService);
  private toastService = inject(ToastService);
  @Input() sparepart: Sparepart | null = null;
  @Input() isModalOpen = false;

  sparepartSaved = output<Sparepart>();
  sparepartDeactivated = output<string>();

  openModal (sparepart: Sparepart) {
    this.sparepart = {...sparepart };
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }

  saveSparepart() {
  if (!this.sparepart) return;
  this.sparepartService.updateSparepart(this.sparepart).subscribe({
    next: (updated) => {
      this.toastService.success('Reservdel uppdaterad!');
      this.sparepartSaved.emit(updated);
      this.closeModal();
    },
    error: (err) => {
      this.toastService.error('Något gick fel vid uppdatering!');
      console.error('Error saving sparepart:', err);
    }
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
      console.error('Error deactivating sparepart:', err)
    }
  });
}
}
