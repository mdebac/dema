import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'lazy',
    loadComponent: () => import('./features/main/main.component').then(m => m.MainComponent),
  }

];


/*
const routes: Routes = [

  { path: '', component: StartComponent,
    children: [
      {
        path: '', component: MainPageComponent,
        resolve: {
          headerResolver
       }
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'error',
        component: ErrorComponent,
      },
      {
        path: 'activate-account',
        component: ActivateAccountComponent,
      },
      {
        path: 'my', component: MainPageMyApartments,
        resolve: {
          headerResolver: headerResolver
        },
        canActivate: [authGuard]
      },
      {
        path: 'cv', component: MainPageMyCv,
        resolve: {
          headerResolver
        },
        canActivate: [authGuard]
      },
      {
        path: ':detail', component: MainPageComponent,
        resolve: {
          headerWithDetailResolver
        }
      },
     //

    ]

  },

  { path: 'show/:id', component: ShowComponent,
    children: [
      {
        path: '', component: PhotoShowComponent
      },
      { path: '',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: '/'
      },
    ]
  },
  { path: 'dashboard', component: MyDashboardComponent,
    children: [
      {
        path: '', component: MyTableComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'photo-show',
        component: PhotoShowComponent
      },
      {
        path: 'table',
        component: MyTableComponent
      },
      {
        path: 'my',
        component: MyApartmentsContainerComponent
      },
      {
        path: 'drag',
        component: MyDragDropComponent
      },
      { path: '',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: '/'
      },
  ]
},
  { path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/'
  },
 { path: 'address', component: MyAddressComponent },
  { path: 'table', component: MyTableComponent },
  { path: 'tree', component: MyTreeComponent },
  { path: 'drag', component: MyDragDropComponent }
];
 */