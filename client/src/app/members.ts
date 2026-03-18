import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-members',
  template: `
    <section class="p-6">
      <h1 class="text-3xl font-bold mb-4">Members Area</h1>
      <p class="text-lg">You are logged in and can now access protected content.</p>
    </section>
  `,
})
export class Members {}
