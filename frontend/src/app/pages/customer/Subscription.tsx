import { useState } from 'react';
import { Layout } from '@/app/components/Layout';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Crown, Zap, Building2, CheckCircle2, X,
  CreditCard, Calendar, AlertCircle, TrendingUp,
  FileText, Cpu, Clock, Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENT_PLAN = {
  name: 'Pro',
  price: 299000,
  renewDate: '23/04/2026',
  copyUsed: 312,
  copyLimit: 500,
  apiCalls: 1250,
  apiLimit: 5000,
};

const INVOICES = [
  { id: 'INV-001', date: '23/03/2026', amount: 299000, status: 'paid', plan: 'Pro' },
  { id: 'INV-002', date: '23/02/2026', amount: 299000, status: 'paid', plan: 'Pro' },
  { id: 'INV-003', date: '23/01/2026', amount: 199000, status: 'paid', plan: 'Pro (Ưu đãi ra mắt)' },
];

// This page is now replaced by Billing.tsx - keeping for legacy redirect