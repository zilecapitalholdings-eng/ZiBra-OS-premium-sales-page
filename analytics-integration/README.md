# ZiBra Sales Page — application and analytics integration

This branch contains the client-side connector for the ZiBra Growth endpoint.

## Integration requirements
1. Include `pilot-application-analytics.js` on the sales page after the pilot application form.
2. Replace the current email-app form with a form whose id is `pilotApplicationForm`.
3. Use these exact input names:
   - `full_name` (required)
   - `business_email` (required)
   - `business_name` (required)
   - `city_state` (required)
   - `business_stage` (required)
   - `business_type` (required)
   - `current_website` (optional)
   - `primary_goal` (required)
   - `website` (hidden honeypot; keep visually hidden but do not disable)
4. Add an element with `data-application-message` inside the form for success/error feedback.
5. Add `data-zibra-event="pilot_cta_clicked"` to each pilot CTA; use `data-zibra-event="journey_selected"` and `data-journey="launch|organize"` on the two journey choices.
6. Add a privacy notice/policy link describing opt-in analytics. Application submission remains available when analytics consent is declined.

The connector stores no full IP address and never captures keystrokes or passwords. Visitor/session identifiers are created only after analytics consent. Application fields are submitted to the secure ZiBra Growth Edge Function.

## Backend dependency
The matching migration and Edge Function are in the draft ZiBra Headquarters PR #11. Do not deploy this client script until that backend migration and function are deployed and tested.
