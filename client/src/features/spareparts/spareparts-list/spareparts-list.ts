import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';
import { SparepartDetails } from "../sparepart-details/sparepart-details";

@Component({
  selector: 'app-sparparts-list',
  imports: [SparepartDetails],
  templateUrl: './spareparts-list.html',
  styleUrl: './spareparts-list.css',
})
export class SparepartsList implements OnInit {
  protected sparepartService = inject(SparepartService);
  private cdr = inject(ChangeDetectorRef);
  spareparts: Sparepart[] = []; 
  selectedSparepart: Sparepart | null = null;
  isModalOpen = false;


  ngOnInit(): void {
    this.loadSpareparts();
  }

  loadSpareparts() {
  this.sparepartService.getSpareparts().subscribe({
    next: (data) => {
      console.log('Spareparts loaded:', data);
      this.spareparts = data;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error loading spareparts:', err);
    },
    complete: () => {
      console.log('Subscription completed');
    }
  });
  }

  onSparepartSaved(updated: Sparepart) {
    this.spareparts = this.spareparts.map(s =>
      s.id === updated.id ? updated : s
    );
  }
}
