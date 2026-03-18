import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <section class="p-6">
      <h1 class="text-3xl font-bold mb-4">Welcome</h1>
      <p class="text-lg">Use the login form in the navigation bar to access members-only content.</p>
    </section>
  `,
})
export class Home {}
