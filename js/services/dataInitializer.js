// Initialize data in localStorage if not present

import { userService } from './userService.js';
import { projectService } from './projectService.js';
import { taskService } from './taskService.js';

export function initializeData() {
  // Check if we need to initialize data
  if (!localStorage.getItem('users') && 
      !localStorage.getItem('projects') && 
      !localStorage.getItem('tasks')) {
    
    // Create demo users
    const user1 = userService.createUser({
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Software developer passionate about web applications',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    });
    
    const user2 = userService.createUser({
      name: 'Jane Smith',
      email: 'jane@example.com',
      bio: 'UX designer with a focus on user-centered design',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    });
    
    // Create projects for the first user
    const project1 = projectService.createProject({
      name: 'Website Redesign',
      description: 'Redesign of the company website with modern UI',
      userId: user1.id
    });
    
    const project2 = projectService.createProject({
      name: 'Mobile App Development',
      description: 'Create a new mobile app for tracking fitness activities',
      userId: user1.id
    });
    
    // Create tasks for the first project
    taskService.createTask({
      title: 'Design Homepage',
      description: 'Create mockups for the homepage',
      status: 'completed',
      projectId: project1.id,
      userId: user1.id
    });
    
    taskService.createTask({
      title: 'Implement Navigation',
      description: 'Build responsive navigation menu',
      status: 'in-progress',
      projectId: project1.id,
      userId: user1.id
    });
    
    taskService.createTask({
      title: 'SEO Optimization',
      description: 'Improve site SEO by adding meta tags',
      status: 'pending',
      projectId: project1.id,
      userId: user1.id
    });
    
    // Create tasks for the second project
    taskService.createTask({
      title: 'UI Design',
      description: 'Design user interface for the mobile app',
      status: 'in-progress',
      projectId: project2.id,
      userId: user1.id
    });
    
    taskService.createTask({
      title: 'API Development',
      description: 'Create RESTful API for the mobile app',
      status: 'pending',
      projectId: project2.id,
      userId: user1.id
    });
    
    // Create project for the second user
    const project3 = projectService.createProject({
      name: 'Marketing Campaign',
      description: 'Digital marketing campaign for new product launch',
      userId: user2.id
    });
    
    // Create tasks for the third project
    taskService.createTask({
      title: 'Social Media Strategy',
      description: 'Create a social media strategy for the campaign',
      status: 'completed',
      projectId: project3.id,
      userId: user2.id
    });
    
    taskService.createTask({
      title: 'Content Creation',
      description: 'Develop content for social media posts',
      status: 'in-progress',
      projectId: project3.id,
      userId: user2.id
    });
    
    // Set the first user as the current user
    userService.setCurrentUser(user1.id);
  }
}