import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['isAuthenticated', 'getUserRole']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if authenticated and role is allowed', () => {
    mockLoginService.isAuthenticated.and.returnValue(true);
    mockLoginService.getUserRole.and.returnValue('admin');

    // Create a complete mock for ActivatedRouteSnapshot
    const route = {
      data: { roles: ['admin'] },
      url: [], // Empty array for demonstration purposes
      params: {}, // Empty object
      queryParams: {}, // Empty object
      fragment: '', // Empty string
      outlet: '', // Empty string
      component: null, // Null for component
      routeConfig: null, // Null for routeConfig
      root: null, // Null for root
      parent: null, // Null for parent
      firstChild: null, // Null for firstChild
      children: [], // Empty array for children
      pathFromRoot: [] // Empty array for pathFromRoot
    } as unknown as ActivatedRouteSnapshot; // Cast to unknown before asserting

    const result = guard.canActivate(route, {} as RouterStateSnapshot);

    expect(result).toBeTrue();
  });

  it('should deny access if not authenticated', () => {
    mockLoginService.isAuthenticated.and.returnValue(false);

    const route = {} as ActivatedRouteSnapshot; // Use a minimal mock for this case
    const result = guard.canActivate(route, {} as RouterStateSnapshot);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBeFalse();
  });

  it('should deny access if role is not allowed', () => {
    mockLoginService.isAuthenticated.and.returnValue(true);
    mockLoginService.getUserRole.and.returnValue('user');

    const route = {
      data: { roles: ['admin'] },
      url: [], // Empty array for demonstration purposes
      params: {}, // Empty object
      queryParams: {}, // Empty object
      fragment: '', // Empty string
      outlet: '', // Empty string
      component: null, // Null for component
      routeConfig: null, // Null for routeConfig
      root: null, // Null for root
      parent: null, // Null for parent
      firstChild: null, // Null for firstChild
      children: [], // Empty array for children
      pathFromRoot: [] // Empty array for pathFromRoot
    } as unknown as ActivatedRouteSnapshot; // Cast to unknown before asserting

    const result = guard.canActivate(route, {} as RouterStateSnapshot);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/access-denied']);
    expect(result).toBeFalse();
  });
});
