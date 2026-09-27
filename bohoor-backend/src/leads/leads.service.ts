import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import * as XLSX from 'xlsx';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLead(dto: CreateLeadDto) {
    // Save safely to PostgreSQL database (ACID Guarantee)
    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        questions: dto.questions || null,
        readiness: dto.readiness || null,
        sellerType: dto.sellerType || null,
        commission: dto.commission || null,
        language: dto.language || 'ar',
        unitId: dto.unitId || null,
        source: dto.source || 'WEB',
      },
    });

    return {
      success: true,
      leadId: lead.id,
      message: 'Lead received and securely persisted in database',
    };
  }

  async getAllLeads(page = 1, limit = 100) {
    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count(),
    ]);

    return {
      data: leads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async exportExcel(): Promise<Buffer> {
    const leads = await this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const rows = leads.map((l, index) => {
      const dateStr = new Date(l.createdAt).toLocaleString('ar-EG', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        'م': index + 1,
        'تاريخ الطلب': dateStr,
        'اسم العميل': l.name,
        'رقم الواتساب / الهاتف': l.phone,
        'درجة الجاهزية للتنفيذ': l.readiness || '-',
        'الاستفسارات والأسئلة': l.questions || '-',
        'نوع البائع': l.sellerType === 'DEVELOPER' ? 'مطور مباشر' : (l.sellerType === 'INDIVIDUAL' ? 'إعادة بيع (أفراد)' : (l.sellerType || '-')),
        'العمولة المقدرة': l.commission || '-',
        'رابط / كود الوحدة': l.unitId || '-',
        'المصدر': l.source || 'WEB',
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!views'] = [{ rightToLeft: true }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'طلبات العملاء والمعاينات');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer as Buffer;
  }
}
