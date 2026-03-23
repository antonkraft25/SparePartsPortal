import { Component, inject, OnInit } from '@angular/core';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';

@Component({
  selector: 'app-sparparts-list',
  imports: [],
  templateUrl: './spareparts-list.html',
  styleUrl: './spareparts-list.css',
})
export class SparepartsList implements OnInit {
  protected sparepartService = inject(SparepartService);
  spareparts: Sparepart[] = []; 


  ngOnInit(): void {
    this.loadSpareparts();
  }

  loadSpareparts(){
    this.sparepartService.getSpareparts().subscribe({
      next: (data) => (
        this.spareparts = data
      )
    });
  }
}
