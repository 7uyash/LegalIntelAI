# Autonomous Agents - NyayaViveka AI Investigator

Detailed specification of all autonomous agents, their responsibilities, and workflows.

## Agent System Overview

The system uses 6 specialized autonomous agents that work in parallel to investigate legal documents:

```
┌─────────────────────────────────────────────────────┐
│            Orchestrator Agent                        │
│  • Coordinates all workflows                         │
│  • Distributes tasks                                 │
│  • Manages agent state                               │
│  • Aggregates findings                               │
└──────┬──────────┬──────────┬──────────┬──────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │ Legal  │ │Evidence│ │Contradict│ │Timeline│
   │Research│ │Collection
   │ Agent  │ │ Agent   │ Detection  │Reconstruct
   │        │ │        │ │ Agent     │ Agent
   └────────┘ └────────┘ └────────┘ └────────┘
       │          │          │          │
       └──────┬───┴──────┬───┘          │
              │          │              │
              ▼          ▼              ▼
           ┌─────────────────────────────┐
           │   Risk Assessment Agent     │
           │  • Calculate severity       │
           │  • Evaluate compliance risk │
           │  • Generate risk score      │
           └─────────────────────────────┘
```

---

## 1. Orchestrator Agent

**Role**: Master coordinator and workflow manager

### Responsibilities

1. **Document Analysis**
   - Parse extracted document text
   - Identify legal document type (FIR, contract, notice, etc.)
   - Extract key legal issues
   - Identify involved parties

2. **Task Distribution**
   - Create task queue for other agents
   - Prioritize tasks based on document type
   - Assign resources efficiently
   - Handle task dependencies

3. **Agent Coordination**
   - Activate specialized agents
   - Monitor agent progress
   - Handle agent failures gracefully
   - Ensure parallel execution

4. **State Management**
   - Track analysis progress
   - Maintain workflow state
   - Store intermediate results
   - Log agent activities

5. **Result Aggregation**
   - Collect findings from all agents
   - Resolve conflicting information
   - Create unified analysis
   - Generate overall risk assessment

### Workflow

```
Document Input
        │
        ▼
Parse Document Text
        ├─> Extract metadata
        ├─> Identify document type
        ├─> Find key entities
        └─> Extract legal issues
        │
        ▼
Create Task Distribution
        ├─> Legal research tasks
        ├─> Evidence investigation tasks
        ├─> Contradiction analysis tasks
        ├─> Timeline reconstruction tasks
        └─> Risk assessment tasks
        │
        ▼
Activate Agents (Parallel)
        ├─> Legal Research Agent
        ├─> Evidence Collection Agent
        ├─> Contradiction Detection Agent
        ├─> Timeline Reconstruction Agent
        └─> Risk Assessment Agent
        │
        ▼
Monitor Progress
        └─> Wait for all agents to complete
        │
        ▼
Aggregate Findings
        ├─> Combine legal research
        ├─> Merge evidence findings
        ├─> Compile contradictions
        ├─> Build unified timeline
        └─> Calculate overall risk
        │
        ▼
Generate Final Analysis
```

### Implementation

```python
# backend/app/services/agent_orchestrator.py

class OrchestratorAgent:
    def __init__(self, ai_service, apify_service, timeline_service, 
                 contradiction_detector, report_service):
        self.ai_service = ai_service
        self.apify_service = apify_service
        self.timeline_service = timeline_service
        self.contradiction_detector = contradiction_detector
        self.report_service = report_service
        
    async def activate_agents(self, document_data: Dict):
        """Activate all agents for document analysis"""
        
        # Parse document
        legal_issues = self.ai_service.analyze_legal_document(
            document_data['text']
        )
        
        # Create task queue
        tasks = self._create_task_queue(legal_issues)
        
        # Activate agents in parallel
        results = await asyncio.gather(
            self.legal_research_agent(tasks),
            self.evidence_collection_agent(tasks),
            self.contradiction_detection_agent(tasks),
            self.timeline_reconstruction_agent(tasks),
            self.risk_assessment_agent(tasks),
            return_exceptions=True
        )
        
        # Aggregate findings
        analysis = self._aggregate_findings(results)
        
        return analysis
```

---

## 2. Legal Research Agent

**Role**: Research legal precedents and applicable laws

### Responsibilities

1. **Legal Issue Analysis**
   - Identify applicable laws
   - Find relevant case precedents
   - Search legal databases
   - Extract legal references

2. **Precedent Research**
   - Find similar cases
   - Analyze ruling patterns
   - Extract applicable principles
   - Document case citations

3. **Statutory Analysis**
   - Identify relevant sections
   - Extract applicable statutes
   - Analyze penalty provisions
   - Identify procedural requirements

4. **Legal Context**
   - Provide legal interpretation
   - Explain complex legal concepts
   - Link to case law
   - Highlight legal precedents

### Workflow

```
Legal Issues Extracted
        │
        ▼
Search Legal Databases
        ├─> Statutes and regulations
        ├─> Case law database
        ├─> Legal precedents
        └─> Legal commentary
        │
        ▼
Find Relevant Laws
        ├─> Match issues to laws
        ├─> Extract legal sections
        ├─> Identify penalties
        └─> Note procedural steps
        │
        ▼
Search Case Precedents
        ├─> Similar cases
        ├─> Ruling patterns
        ├─> Settlement outcomes
        └─> Appeal results
        │
        ▼
Generate Legal Research Report
        ├─> Applicable laws
        ├─> Case references
        ├─> Legal interpretation
        └─> Recommendations
```

---

## 3. Evidence Collection Agent

**Role**: Autonomous web investigation and evidence gathering

### Responsibilities

1. **Web Search**
   - Search for contextual information
   - Find public records
   - Investigate entities mentioned
   - Gather news articles

2. **Apify Integration**
   - Use Google Search actor
   - Employ website scrapers
   - Activate news crawlers
   - Collect regulatory information

3. **Evidence Compilation**
   - Summarize findings
   - Rate relevance
   - Extract key information
   - Source verification

4. **Data Collection**
   - Company information
   - Person background
   - News coverage
   - Public records

### Workflow

```
Entity List from Document
        │
        ▼
Activate Apify Actors
        ├─> Google Search Scraper
        ├─> Website Content Crawler
        ├─> News Scraping Actor
        └─> Public Records Crawler
        │
        ▼
Search Web for Evidence
        ├─> Company registrations
        ├─> News articles
        ├─> Public filings
        ├─> Industry reports
        └─> Social media mentions
        │
        ▼
Investigate Entities
        ├─> Company background
        ├─> Person history
        ├─> Location information
        └─> Relationship mapping
        │
        ▼
Collect Evidence
        ├─> News articles (with dates)
        ├─> Public records (verified)
        ├─> Industry reports
        └─> Background information
        │
        ▼
Rate Evidence Quality
        ├─> Source credibility
        ├─> Information recency
        ├─> Relevance scoring
        └─> Verification status
        │
        ▼
Generate Evidence Report
```

### Implementation

```python
# backend/app/services/apify_service.py

class EvidenceCollectionAgent:
    def __init__(self, apify_client):
        self.apify_client = apify_client
        
    async def collect_evidence(self, entities: List[str], 
                               investigation_type: str):
        """Collect web evidence for entities"""
        
        evidence = []
        
        for entity in entities:
            # Search company/person information
            company_evidence = await self._search_company(entity)
            evidence.extend(company_evidence)
            
            # Search news articles
            news_evidence = await self._search_news(entity)
            evidence.extend(news_evidence)
            
            # Search public records
            records_evidence = await self._search_records(entity)
            evidence.extend(records_evidence)
        
        # Rate and compile evidence
        compiled = self._compile_evidence(evidence)
        
        return compiled
```

---

## 4. Contradiction Detection Agent

**Role**: Identify inconsistencies and anomalies

### Responsibilities

1. **Statement Analysis**
   - Compare conflicting statements
   - Identify contradictions
   - Find inconsistencies
   - Flag suspicious claims

2. **Timeline Validation**
   - Check temporal consistency
   - Identify impossible sequences
   - Find timeline conflicts
   - Detect causality issues

3. **Information Gaps**
   - Identify missing information
   - Note unexplained items
   - Find incomplete details
   - Flag unclear statements

4. **Anomaly Detection**
   - Pattern analysis
   - Statistical anomalies
   - Unusual transactions
   - Suspicious activities

### Workflow

```
Document Statements
        │
        ▼
Extract All Claims
        ├─> Quotes from text
        ├─> Key assertions
        ├─> Numerical claims
        └─> Timeline events
        │
        ▼
Compare Statements
        ├─> Cross-reference claims
        ├─> Find contradictions
        ├─> Note inconsistencies
        └─> Flag conflicts
        │
        ▼
Analyze Gaps
        ├─> Missing information
        ├─> Incomplete details
        ├─> Unclear references
        └─> Unexplained items
        │
        ▼
Validate Timeline
        ├─> Check date order
        ├─> Verify sequences
        ├─> Identify conflicts
        └─> Test causality
        │
        ▼
Rate Contradictions
        ├─> Severity scoring
        ├─> Impact assessment
        ├─> Risk evaluation
        └─> Confidence scoring
        │
        ▼
Generate Contradiction Report
```

---

## 5. Timeline Reconstruction Agent

**Role**: Build chronological event sequences

### Responsibilities

1. **Date Extraction**
   - Extract all dates mentioned
   - Parse date formats
   - Standardize dates
   - Handle ambiguities

2. **Event Identification**
   - Extract chronological events
   - Categorize events
   - Note significance
   - Link to evidence

3. **Sequence Building**
   - Order events chronologically
   - Identify causality
   - Map event relationships
   - Build narrative flow

4. **Timeline Validation**
   - Check logical consistency
   - Verify temporal order
   - Identify conflicts
   - Validate completeness

### Workflow

```
Document Text
        │
        ▼
Extract Dates
        ├─> Parse date formats
        ├─> Normalize dates
        ├─> Handle ambiguities
        └─> Flag uncertain dates
        │
        ▼
Extract Events
        ├─> Identify actions
        ├─> Categorize events
        ├─> Link to dates
        └─> Note significance
        │
        ▼
Build Timeline
        ├─> Order chronologically
        ├─> Create sequence
        ├─> Map relationships
        └─> Build narrative
        │
        ▼
Validate Sequence
        ├─> Check logic
        ├─> Verify order
        ├─> Find conflicts
        └─> Test causality
        │
        ▼
Generate Timeline
        ├─> Visual representation
        ├─> Event details
        ├─> Significance markers
        └─> Key relationships
```

---

## 6. Risk Assessment Agent

**Role**: Evaluate legal severity and compliance risks

### Responsibilities

1. **Severity Scoring**
   - Rate legal issue severity
   - Evaluate case complexity
   - Assess damages potential
   - Calculate risk score

2. **Fraud Analysis**
   - Assess fraud likelihood
   - Rate deception indicators
   - Evaluate evidence strength
   - Predict success likelihood

3. **Compliance Analysis**
   - Identify compliance violations
   - Assess regulatory risks
   - Evaluate audit vulnerability
   - Rate compliance severity

4. **Overall Risk**
   - Aggregate risk scores
   - Calculate final rating
   - Identify critical areas
   - Prioritize actions

### Workflow

```
Analysis Data
        │
        ▼
Assess Legal Issues
        ├─> Rate severity
        ├─> Evaluate complexity
        ├─> Assess strength
        └─> Calculate score
        │
        ▼
Analyze Fraud Indicators
        ├─> Deception markers
        ├─> Suspicious patterns
        ├─> Motive assessment
        └─> Likelihood scoring
        │
        ▼
Evaluate Compliance
        ├─> Identify violations
        ├─> Assess severity
        ├─> Rate vulnerability
        └─> Calculate risk
        │
        ▼
Calculate Overall Risk
        ├─> Weight all factors
        ├─> Generate final score
        ├─> Rate overall severity
        └─> Identify critical areas
        │
        ▼
Generate Risk Report
        ├─> Risk metrics
        ├─> Severity ratings
        ├─> Recommendations
        └─> Priority actions
```

---

## Agent Communication

### Inter-Agent Data Flow

```
Orchestrator Agent
    │
    ├─> Sends: document_data, legal_issues
    │
    ├─> Legal Research Agent
    │   └─> Returns: applicable_laws, precedents, legal_context
    │
    ├─> Evidence Collection Agent
    │   └─> Returns: web_evidence, entity_info, news_articles
    │
    ├─> Contradiction Detection Agent
    │   └─> Returns: contradictions, gaps, anomalies
    │
    ├─> Timeline Reconstruction Agent
    │   └─> Returns: timeline, events, sequences
    │
    └─> Risk Assessment Agent
        └─> Returns: risk_scores, severity_ratings, recommendations
```

---

## Agent State Management

```python
# Agent Status Tracking
agent_state = {
    "agent_id": "legal_research_001",
    "status": "in-progress",  # pending, in-progress, completed, error
    "progress": 0.75,  # 0-1
    "started_at": "2026-05-10T12:10:00",
    "estimated_completion": "2026-05-10T12:15:00",
    "results": {...},
    "errors": [],
    "logs": [...]
}
```

---

## Future Agent Enhancements

1. **Document Similarity Agent**
   - Compare with historical cases
   - Find precedent matches
   - Rate similarity

2. **Prediction Agent**
   - Predict case outcomes
   - Estimate settlement amounts
   - Forecast legal success

3. **Recommendation Agent**
   - Generate action plans
   - Suggest strategies
   - Prioritize next steps

4. **Compliance Monitoring Agent**
   - Track regulatory changes
   - Alert on new requirements
   - Assess current compliance

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0
