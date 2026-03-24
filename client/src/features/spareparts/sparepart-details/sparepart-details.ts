import { Component, inject, Input, input, output } from '@angular/core';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sparepart-details',
  imports: [FormsModule],
  templateUrl: './sparepart-details.html',
  styleUrl: './sparepart-details.css',
})
export class SparepartDetails {
  protected sparepartService = inject(SparepartService);
  @Input() sparepart: Sparepart | null = null;
  @Input() isModalOpen = false;

  sparepartSaved = output<Sparepart>();

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
      this.sparepartSaved.emit(updated);
      this.closeModal();
    },
    error: (err) => {
      console.error('Error saving sparepart:', err);
    }
  });
}
}
