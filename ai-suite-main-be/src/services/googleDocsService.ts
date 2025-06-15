import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import fs from 'fs';

class GoogleDocsService {
  private static instance: GoogleDocsService;
  private auth: any;
  private docs: any;
  private drive: any;
  private TOKEN_PATH = path.join(process.cwd(), 'token.json');

  private constructor() {}

  public static getInstance(): GoogleDocsService {
    if (!GoogleDocsService.instance) {
      GoogleDocsService.instance = new GoogleDocsService();
    }
    return GoogleDocsService.instance;
  }

  private async loadSavedCredentialsIfExist() {
    try {
      if (fs.existsSync(this.TOKEN_PATH)) {
        const content = fs.readFileSync(this.TOKEN_PATH, 'utf-8');
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  private async saveCredentials(client: any) {
    const content = await client.credentials;
    fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(content));
  }

  private async initialize() {
    if (!this.auth) {
      try {
        // Path to your credentials file
        const credentialsPath = path.join(
          process.cwd(),
          'client_secret_246261908329-f1dq0s44kfv13ta4dld30lfj6e79jsh9.apps.googleusercontent.com.json'
        );
        
        // Check if credentials file exists
        if (!fs.existsSync(credentialsPath)) {
          throw new Error('Google credentials file not found. Please check the credentials file path.');
        }

        // Load credentials
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
        
        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
          credentials.web.client_id,
          credentials.web.client_secret,
          credentials.web.redirect_uris[0]
        );

        // Try to load saved credentials
        let auth = await this.loadSavedCredentialsIfExist();
        
        if (!auth) {
          // If no saved credentials, authenticate
          auth = await authenticate({
            keyfilePath: credentialsPath,
            scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
            port: 5001,
            client: oauth2Client
          });

          // Save credentials for future use
          await this.saveCredentials(auth);
        }

        this.auth = auth;

        // Initialize Google Docs and Drive APIs
        this.docs = google.docs({ version: 'v1', auth: this.auth });
        this.drive = google.drive({ version: 'v3', auth: this.auth });
        
        console.log('Google Docs service initialized successfully');
      } catch (error: any) {
        console.error('Error initializing Google Docs service:', error);
        throw new Error(`Failed to initialize Google Docs service: ${error.message}`);
      }
    }
  }

  async createDocumentFromMarkdown(content: string, title: string) {
    try {
      await this.initialize();

      // Create a new document
      const createResponse = await this.docs.documents.create({
        requestBody: {
          title: title
        }
      });

      const documentId = createResponse.data.documentId;

      // Convert markdown to plain text (you might want to implement proper markdown to Google Docs conversion)
      const plainText = content.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove markdown bold syntax

      // Update the document with content
      await this.docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: {
                  index: 1
                },
                text: plainText
              }
            }
          ]
        }
      });

      // Make the document publicly accessible
      await this.drive.permissions.create({
        fileId: documentId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      // Get the document URL
      const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

      return {
        success: true,
        data: {
          documentId,
          documentUrl
        }
      };
    } catch (error: any) {
      console.error('Error creating Google Doc:', error);
      throw new Error('Failed to create Google Doc');
    }
  }
}

export default GoogleDocsService; 