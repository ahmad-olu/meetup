Based on your Saturday/Wednesday co-working meetup platform spec, here's what remains for your MVP:

---

## **Pages Still Needed for MVP**

### 1. **Event Discovery & Browsing** (Critical)
- `/events` - Main events listing page with filters
- `/events/[location]` - Events filtered by location
- `/events/[category]` - Events filtered by category (programming, design, etc.)
- `/events/[id]` - Event details page with voting, chat, donations

### 2. **Event Management** (Critical)
- `/events/[id]/edit` - Edit event details
- `/events/[id]/attendees` - View registered attendees
- `/events/[id]/analytics` - Event analytics for organizers
- `/my-events` - Dashboard for all your created events

### 3. **User Profile** (Critical)
- `/profile` - View/edit your profile
- `/profile/[username]` - Public profile view
- `/profile/verification` - Verification submission flow
- `/profile/stripe-connect` - Stripe Connect onboarding

### 4. **Voting System** (Critical)
- Component on event details page
- `/events/[id]/voters` - See who voted (optional)

### 5. **Donations/Payments** (Critical - Your Revenue)
- `/events/[id]/donate` - Donation checkout page
- `/donations/success` - Payment confirmation
- `/donations/history` - Your donation history

### 6. **Chat System** (Important)
- Component embedded in event details page
- Real-time WebSocket connection

### 7. **Verification System** (Important)
- `/verification/start` - Begin verification process
- `/verification/upload-id` - Upload government ID
- `/verification/upload-address` - Upload address proof
- `/verification/selfie` - Selfie verification
- `/verification/pending` - Waiting for approval status

### 8. **Admin Dashboard** (Important)
- `/admin/verifications` - Review verification requests
- `/admin/events` - Moderate reported events
- `/admin/reports` - View fraud reports
- `/admin/analytics` - Platform-wide metrics

### 9. **Location Management** (Important)
- `/locations` - Browse all available locations
- `/locations/add` - Request new location
- Component: Location selector dropdown (Country → State → City)

### 10. **Notifications** (Nice to Have)
- `/notifications` - Notification center
- Real-time notification bell component

### 11. **Search** (Nice to Have)
- `/search` - Global search results
- Search bar component in navbar

### 12. **Settings** (Nice to Have)
- `/settings` - Account settings
- `/settings/notifications` - Notification preferences
- `/settings/saved-locations` - Manage saved locations

---

## **Complete API Routes Architecture**

### **Authentication**
```
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/signout
GET    /api/auth/session
POST   /api/auth/verify-email
```

### **Events**
```
GET    /api/events                    # List all events (with filters)
GET    /api/events/[id]               # Get single event
POST   /api/events                    # Create new event (✅ Done)
PATCH  /api/events/[id]               # Update event
DELETE /api/events/[id]               # Delete event
GET    /api/events/[id]/votes         # Get vote count
POST   /api/events/[id]/vote          # Vote for event
DELETE /api/events/[id]/vote          # Unvote
GET    /api/events/[id]/attendees     # List attendees
POST   /api/events/[id]/register      # Register for event
DELETE /api/events/[id]/register      # Unregister from event
GET    /api/events/[id]/analytics     # Event analytics
POST   /api/events/[id]/cancel        # Cancel event
POST   /api/events/[id]/complete      # Mark event as completed

# Co-organizers
GET    /api/events/[id]/organizers    # List co-organizers
POST   /api/events/[id]/organizers    # Add co-organizer
DELETE /api/events/[id]/organizers/[userId] # Remove co-organizer

# Reports
POST   /api/events/[id]/report        # Report event
```

### **Locations**
```
GET    /api/locations                 # Get all locations (hierarchical)
GET    /api/locations/countries       # List all countries
GET    /api/locations/countries/[code]/states # States in country
GET    /api/locations/countries/[code]/states/[state]/cities # Cities
POST   /api/locations                 # Request new location
```

### **Categories**
```
GET    /api/categories                # List all event categories
GET    /api/categories/[slug]         # Get category details
```

### **Donations**
```
POST   /api/donations/create-intent   # Create Stripe payment intent
POST   /api/donations/confirm         # Confirm donation
GET    /api/donations/history         # User's donation history
GET    /api/events/[id]/donations     # Donations for specific event
POST   /api/donations/refund          # Request refund
```

### **Chat**
```
GET    /api/events/[id]/messages      # Get chat messages
POST   /api/events/[id]/messages      # Send message
PATCH  /api/events/[id]/messages/[msgId] # Edit message
DELETE /api/events/[id]/messages/[msgId] # Delete message

# WebSocket endpoint
WS     /api/events/[id]/chat          # Real-time chat connection
```

### **User Profile**
```
GET    /api/users/[username]          # Get public profile
PATCH  /api/users/me                  # Update own profile
GET    /api/users/me/events           # User's created events
GET    /api/users/me/registered-events # Events user registered for
GET    /api/users/me/votes            # Events user voted for
POST   /api/users/me/avatar           # Upload profile image
```

### **Verification**
```
POST   /api/verification/submit       # Submit verification request
GET    /api/verification/status       # Check verification status
POST   /api/verification/upload-id    # Upload government ID
POST   /api/verification/upload-address # Upload address proof
POST   /api/verification/upload-selfie  # Upload selfie
GET    /api/verification/documents    # Get submitted docs

# Admin routes
GET    /api/admin/verifications       # List pending verifications
POST   /api/admin/verifications/[id]/approve
POST   /api/admin/verifications/[id]/reject
```

### **Stripe Connect**
```
POST   /api/stripe/create-account     # Create Stripe Connect account
GET    /api/stripe/account-status     # Check onboarding status
GET    /api/stripe/account-link       # Get onboarding link
POST   /api/stripe/disconnect         # Disconnect Stripe account
GET    /api/stripe/balance            # Get organizer's balance
GET    /api/stripe/payouts            # List payouts
```

### **Notifications**
```
GET    /api/notifications             # Get user notifications
PATCH  /api/notifications/[id]/read   # Mark as read
PATCH  /api/notifications/read-all    # Mark all as read
DELETE /api/notifications/[id]        # Delete notification
```

### **Search**
```
GET    /api/search?q=query&type=events # Global search
GET    /api/search/events?location=...&category=... # Advanced filters
```

### **Reports**
```
POST   /api/reports                   # Create report
GET    /api/admin/reports             # List all reports (admin)
PATCH  /api/admin/reports/[id]        # Update report status
```

### **Settings**
```
GET    /api/settings/notifications    # Get notification preferences
PATCH  /api/settings/notifications    # Update preferences
GET    /api/settings/saved-locations  # Get saved locations
POST   /api/settings/saved-locations  # Add location
DELETE /api/settings/saved-locations/[id] # Remove location
```

---

## **MVP Feature Prioritization**

### **Phase 1: Core Loop (Do First)** ✅ = Done
✅ Authentication
✅ Event Creation
🔴 **Event Discovery** - Browse/filter events
🔴 **Event Details Page** - View event with voting
🔴 **Voting System** - Vote for event viability
🔴 **Event Registration** - RSVP for approved events

### **Phase 2: Trust & Safety (Critical for Launch)**
🔴 **Verification System** - ID/Address/Selfie upload
🔴 **Admin Review Dashboard** - Approve/reject verifications
🔴 **Event Reports** - Flag inappropriate events

### **Phase 3: Revenue (Day 1 Monetization)**
🔴 **Stripe Connect** - Organizer account setup
🔴 **Donation Flow** - Payment checkout
🔴 **Donation Tracking** - Show funding progress
🔴 **Transaction Fee** - 3-5% platform fee

### **Phase 4: Engagement**
🔴 **Event Chat** - Real-time discussion
🟡 **Co-organizer Management** - Add verified co-organizers
🟡 **Notifications** - Email/push for events
🟡 **User Profiles** - Public profile pages

### **Phase 5: Polish**
🟢 **Search & Filters** - Advanced discovery
🟢 **Location Management** - Save favorite locations
🟢 **Event Analytics** - Organizer insights
🟢 **Countdown Timers** - Homepage widgets

---

## **Critical Missing Features for MVP**

### **1. Event Discovery (Highest Priority)**
**Why:** Users can't find events to vote on or attend

**Pages needed:**
- Events listing with filters (location, category, date, status)
- Event details page with:
  - Voting UI (progress bar, vote button)
  - Attendee list
  - Donation widget
  - Chat embed
  - Countdown timer

**API routes:**
```
GET /api/events?location=...&category=...&status=approved
GET /api/events/[id]
POST /api/events/[id]/vote
POST /api/events/[id]/register
```

### **2. Voting System (Critical for Viability Model)**
**Why:** This is your unique value prop—community validates events

**Components needed:**
- Vote button with count
- Progress bar (X / Y votes needed)
- Voting deadline countdown
- Visual feedback on vote/unvote

**API routes:**
```
POST /api/events/[id]/vote
DELETE /api/events/[id]/vote
GET /api/events/[id]/votes
```

**Auto-approval logic:**
```typescript
// Cron job or real-time check
if (event.current_votes >= event.min_votes_required &&
    new Date() < event.voting_deadline) {
  event.status = 'approved';
  // Send notifications to voters
}
```

### **3. Verification System (Trust Foundation)**
**Why:** Only verified users can collect donations

**Flow:**
1. User clicks "Get Verified"
2. Upload government ID → `/api/verification/upload-id`
3. Upload address proof → `/api/verification/upload-address`
4. Take selfie → `/api/verification/upload-selfie`
5. Submit → `/api/verification/submit`
6. Admin reviews → `/api/admin/verifications/[id]/approve`

**Admin dashboard needs:**
- Queue of pending verifications
- Side-by-side document viewer
- Approve/Reject buttons
- Rejection reason field

### **4. Stripe Connect Integration (Revenue)**
**Why:** Direct payment to organizers, you take fee

**Implementation:**
```typescript
// 1. Organizer creates Connect account
POST /api/stripe/create-account
→ Returns onboarding URL

// 2. User completes Stripe onboarding
// Redirect back to: /profile/stripe-connect?success=true

// 3. When user donates:
POST /api/donations/create-intent
{
  eventId: "uuid",
  amount: 50.00,
  currency: "usd"
}

// Backend creates PaymentIntent with application_fee_amount
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // $50.00
  currency: 'usd',
  application_fee_amount: 150, // 3% fee = $1.50
  transfer_data: {
    destination: organizerStripeAccountId,
  },
});

// 4. Frontend completes payment
// 5. Funds go directly to organizer minus fee
```

### **5. Event Chat (Engagement Driver)**
**Why:** Keeps users on platform, builds community

**Implementation:**
- Socket.io for real-time messaging
- Fallback to polling for older browsers
- Store messages in `chat_messages` table
- Show online users count

**WebSocket events:**
```typescript
// Client
socket.emit('join-event-chat', { eventId });
socket.emit('send-message', { eventId, text });
socket.on('new-message', (msg) => { /* append */ });
socket.on('user-joined', (user) => { /* show */ });

// Server
io.of('/events/:id/chat').on('connection', (socket) => {
  socket.on('send-message', async (data) => {
    const msg = await db.insert(chat_messages).values({...});
    io.emit('new-message', msg);
  });
});
```

---

## **Database Enhancements Needed**

Your schema is solid, but add these indexes for performance:

```sql
-- Event discovery queries
CREATE INDEX idx_events_approved_date ON events(proposed_date)
  WHERE status = 'approved';

CREATE INDEX idx_events_location_status ON events(location_id, status);

CREATE INDEX idx_events_category_status ON events(category_id, status);

-- Voting queries
CREATE INDEX idx_votes_event_count ON event_votes(event_id);

-- Donation queries
CREATE INDEX idx_donations_event ON donations(event_id, status);

-- Chat queries
CREATE INDEX idx_chat_event_recent ON chat_messages(event_id, sent_at DESC);

-- Notification queries
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, created_at DESC);
```

---

## **Quick MVP Roadmap (6-8 Weeks)**

### **Week 1-2: Event Discovery**
- [ ] Events listing page with filters
- [ ] Event details page
- [ ] Voting UI and logic
- [ ] Auto-approval cron job

### **Week 3: Verification**
- [ ] Document upload flow
- [ ] Admin review dashboard
- [ ] Verification badge display

### **Week 4-5: Payments**
- [ ] Stripe Connect onboarding
- [ ] Donation checkout flow
- [ ] Transaction fee logic
- [ ] Refund handling

### **Week 6: Chat**
- [ ] Socket.io setup
- [ ] Chat UI component
- [ ] Message persistence
- [ ] Moderation tools

### **Week 7: Registration & Notifications**
- [ ] Event registration flow
- [ ] Email notifications (SendGrid)
- [ ] Countdown timers
- [ ] Reminder system

### **Week 8: Polish & Admin**
- [ ] User profiles
- [ ] Event reports
- [ ] Admin moderation tools
- [ ] Basic analytics

---

## **Summary - Your MVP Checklist**

**Critical (Must Have):**
- ✅ Auth & Event Creation (Done)
- 🔴 Event Discovery (3 pages, 6 API routes)
- 🔴 Voting System (2 API routes, 1 component)
- 🔴 Verification (4 pages, 7 API routes)
- 🔴 Stripe Connect + Donations (4 pages, 8 API routes)
- 🔴 Event Chat (1 component, WebSocket)

**Important (Should Have):**
- 🟡 User Profiles (2 pages, 4 API routes)
- 🟡 Event Registration (2 API routes)
- 🟡 Notifications (2 pages, 4 API routes)

**Nice to Have (Can Wait):**
- 🟢 Search (1 page, 2 API routes)
- 🟢 Analytics (2 pages, 3 API routes)
- 🟢 Co-organizer management

**Total Pages Remaining: ~15-18 pages for full MVP**

Focus on **Event Discovery + Voting + Verification** first, then **Payments**. That gets you to a functional beta.

Want me to create detailed implementation plans or starter code for any of these features?
