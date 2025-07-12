# Supabase Setup Guide for Virtual Try-On Glasses

This guide will help you set up the necessary database tables and storage buckets in Supabase for the Virtual Try-On Glasses application.

## Prerequisites

- Supabase project created at: `https://dlcivaxzuqoutbbhfwot.supabase.co`
- Supabase CLI (optional, for local development)

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsY2l2YXh6dXFvdXRiYmhmd290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzEwMTIsImV4cCI6MjA2MjM0NzAxMn0.2CYiMEcnca5quUefny5sbXKtMa7Zg1i8aVJVMDfynho
VITE_SUPABASE_URL=https://dlcivaxzuqoutbbhfwot.supabase.co
```

## Database Tables Setup

### 1. Try-On Sessions Table

```sql
-- Create try_on_sessions table
CREATE TABLE try_on_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  glasses_id TEXT NOT NULL,
  screenshot_url TEXT,
  adjustments JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE try_on_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own sessions
CREATE POLICY "Users can manage their own try-on sessions" ON try_on_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_try_on_sessions_user_id ON try_on_sessions(user_id);
CREATE INDEX idx_try_on_sessions_created_at ON try_on_sessions(created_at DESC);
```

### 2. User Preferences Table

```sql
-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  face_shape TEXT,
  preferred_styles TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

### 3. Product Reviews Table

```sql
-- Create product_reviews table
CREATE TABLE product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own reviews
CREATE POLICY "Users can manage their own reviews" ON product_reviews
  FOR ALL USING (auth.uid() = user_id);

-- Create policy for users to read all reviews
CREATE POLICY "Users can read all reviews" ON product_reviews
  FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_created_at ON product_reviews(created_at DESC);
```

### 4. Analytics Events Table

```sql
-- Create analytics_events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own events
CREATE POLICY "Users can insert their own events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to read their own events
CREATE POLICY "Users can read their own events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
```

## Storage Buckets Setup

### 1. Screenshots Bucket

```sql
-- Create screenshots storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true);

-- Create policy for users to upload their own screenshots
CREATE POLICY "Users can upload their own screenshots" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'screenshots' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for users to view their own screenshots
CREATE POLICY "Users can view their own screenshots" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'screenshots' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for users to delete their own screenshots
CREATE POLICY "Users can delete their own screenshots" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'screenshots' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 2. Custom Glasses Bucket

```sql
-- Create custom_glasses storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('custom_glasses', 'custom_glasses', true);

-- Create policy for users to upload their own custom glasses
CREATE POLICY "Users can upload their own custom glasses" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'custom_glasses' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for users to view their own custom glasses
CREATE POLICY "Users can view their own custom glasses" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'custom_glasses' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for users to delete their own custom glasses
CREATE POLICY "Users can delete their own custom glasses" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'custom_glasses' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Database Functions

### 1. Update Timestamp Function

```sql
-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at column
CREATE TRIGGER update_try_on_sessions_updated_at 
  BEFORE UPDATE ON try_on_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Analytics Helper Function

```sql
-- Create function to track events with user context
CREATE OR REPLACE FUNCTION track_event(event_name TEXT, properties JSONB DEFAULT '{}')
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (user_id, event_name, properties)
  VALUES (auth.uid(), event_name, properties)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Row Level Security (RLS) Policies

All tables have Row Level Security enabled with appropriate policies:

- **try_on_sessions**: Users can only access their own sessions
- **user_preferences**: Users can only access their own preferences
- **product_reviews**: Users can manage their own reviews but read all reviews
- **analytics_events**: Users can insert and read their own events
- **storage.objects**: Users can manage files in their own folders

## API Endpoints

The application uses the following Supabase features:

### Authentication
- `supabase.auth.signUp()` - User registration
- `supabase.auth.signInWithPassword()` - User login
- `supabase.auth.signOut()` - User logout
- `supabase.auth.getUser()` - Get current user

### Database Operations
- `supabase.from('try_on_sessions').insert()` - Save try-on sessions
- `supabase.from('try_on_sessions').select()` - Get user sessions
- `supabase.from('user_preferences').upsert()` - Save user preferences
- `supabase.from('product_reviews').insert()` - Save product reviews

### Storage Operations
- `supabase.storage.from('screenshots').upload()` - Upload screenshots
- `supabase.storage.from('screenshots').getPublicUrl()` - Get public URLs

### Real-time Subscriptions
- `supabase.channel().on('postgres_changes')` - Real-time updates

## Testing the Setup

1. **Test Authentication**:
   ```javascript
   const { data, error } = await supabase.auth.signUp({
     email: 'test@example.com',
     password: 'password123'
   });
   ```

2. **Test Database Operations**:
   ```javascript
   const { data, error } = await supabase
     .from('try_on_sessions')
     .insert([{
       user_id: user.id,
       glasses_id: 'test-glasses',
       adjustments: { scale: 1.0, offsetX: 0, offsetY: 0, rotation: 0 }
     }]);
   ```

3. **Test Storage Operations**:
   ```javascript
   const { data, error } = await supabase.storage
     .from('screenshots')
     .upload(`${user.id}/test.png`, file);
   ```

## Security Considerations

1. **Row Level Security**: All tables have RLS enabled
2. **User Isolation**: Users can only access their own data
3. **File Organization**: Storage files are organized by user ID
4. **Input Validation**: All inputs are validated on the client side
5. **Rate Limiting**: Consider implementing rate limiting for production

## Monitoring and Analytics

The application tracks various events for analytics:

- `screenshot_taken` - When user takes a screenshot
- `glasses_tried_on` - When user tries on glasses
- `preferences_updated` - When user updates preferences
- `session_saved` - When try-on session is saved

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure user is authenticated before database operations
2. **Storage Permission Errors**: Check bucket policies and file paths
3. **Real-time Connection Issues**: Verify channel subscription setup

### Debug Queries

```sql
-- Check user sessions
SELECT * FROM try_on_sessions WHERE user_id = auth.uid();

-- Check storage files
SELECT * FROM storage.objects WHERE bucket_id = 'screenshots';

-- Check analytics events
SELECT * FROM analytics_events WHERE user_id = auth.uid();
```

## Next Steps

1. Set up email templates for authentication
2. Configure backup strategies
3. Set up monitoring and alerting
4. Implement data retention policies
5. Add admin dashboard for user management

This setup provides a complete backend infrastructure for the Virtual Try-On Glasses application with proper security, scalability, and user data management. 